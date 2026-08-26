"use client";

import { useEffect, useState, useRef } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Input from "@/components/ui/Input";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import {
  PlusSignIcon,
  CheckmarkCircle03Icon,
  Cancel01Icon,
  Edit02Icon,
  Time02Icon,
  CheckmarkBadge01Icon,
  Delete02Icon,
  Image01Icon,
  LinkSquare02Icon,
  TelegramIcon,
  AlertCircleIcon,
  Upload04Icon,
} from "hugeicons-react";

const VERIFICATION_METHODS = [
  { value: "LINK_CHECK", label: "Link Check (Auto-verify)" },
  { value: "SOCIAL_FOLLOW", label: "Social Follow (Manual Review)" },
  { value: "MANUAL", label: "Manual Verification" },
  { value: "MANUAL_TELEGRAM", label: "Manual Verification + Telegram Required" },
  { value: "REFERRAL", label: "Referral" },
];

const CATEGORIES = [
  { value: "COMMUNITY", label: "Community" },
  { value: "TELEGRAM", label: "Telegram Quest" },
  { value: "TWITTER", label: "X (Twitter) Quest" },
  { value: "ONCHAIN", label: "On-Chain Activity" },
];

export default function AdminTasksPage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Pending completions state
  const [pendingCompletions, setPendingCompletions] = useState([]);
  const [completionFilter, setCompletionFilter] = useState("PENDING");
  const [isLoadingCompletions, setIsLoadingCompletions] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);

  // Active tab state
  const [activeTab, setActiveTab] = useState("tasks"); // "tasks" | "review"

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    verificationMethod: "LINK_CHECK",
    rewardAmount: 10,
    externalUrl: "",
    imageUrl: "",
    category: "COMMUNITY",
    active: true,
  });

  const fileInputRef = useRef(null);
  const { upload: uploadImage, isUploading: isUploadingImage } = useCloudinaryUpload({
    type: "task-image",
    walletAddress: address,
  });

  useEffect(() => {
    loadTasks();
    loadCompletions();
  }, []);

  useEffect(() => {
    loadCompletions();
  }, [completionFilter]);

  async function loadTasks() {
    try {
      const res = await fetch("/api/admin/tasks", {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadCompletions() {
    setIsLoadingCompletions(true);
    try {
      const res = await fetch(`/api/admin/tasks/completions?status=${completionFilter}`, {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) setPendingCompletions(data.completions);
    } catch (err) {
      console.error("Failed to load completions:", err);
    } finally {
      setIsLoadingCompletions(false);
    }
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      verificationMethod: "LINK_CHECK",
      rewardAmount: 10,
      externalUrl: "",
      imageUrl: "",
      category: "COMMUNITY",
      active: true,
    });
    setShowCreateForm(false);
    setEditingTask(null);
  }

  function startEdit(task) {
    setEditingTask(task.id);
    setForm({
      title: task.title,
      description: task.description,
      verificationMethod: task.verificationMethod,
      rewardAmount: task.rewardAmount,
      externalUrl: task.externalUrl || "",
      imageUrl: task.imageUrl || "",
      category: task.category || (task.verificationMethod === "MANUAL_TELEGRAM" ? "TELEGRAM" : "COMMUNITY"),
      active: task.active,
    });
    setShowCreateForm(true);
    setActiveTab("tasks");
  }

  async function handleImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setForm((prev) => ({ ...prev, imageUrl: uploadedUrl }));
        addToast({ variant: "success", message: "Task image uploaded successfully!" });
      }
    } catch (err) {
      addToast({ variant: "error", message: err.message || "Failed to upload image" });
    }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.description.trim()) {
      addToast({ variant: "error", message: "Title and description are required" });
      return;
    }

    setIsSaving(true);
    try {
      const isUpdate = !!editingTask;
      const res = await fetch("/api/admin/tasks", {
        method: isUpdate ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({
          ...(isUpdate && { taskId: editingTask }),
          title: form.title.trim(),
          description: form.description.trim(),
          verificationMethod: form.verificationMethod,
          rewardAmount: Number(form.rewardAmount),
          externalUrl: form.externalUrl.trim() || null,
          imageUrl: form.imageUrl.trim() || null,
          category: form.category,
          requiresTelegram: form.verificationMethod === "MANUAL_TELEGRAM",
          active: form.active,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast({
          variant: "success",
          message: isUpdate ? "Task updated successfully!" : "Task created successfully!",
        });
        resetForm();
        await loadTasks();
      } else {
        addToast({ variant: "error", message: data.message || "Failed to save" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Network error" });
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleActive(task) {
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({
          taskId: task.id,
          active: !task.active,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({
          variant: "success",
          message: task.active ? "Task deactivated" : "Task activated",
        });
        await loadTasks();
      }
    } catch (err) {
      addToast({ variant: "error", message: "Failed to toggle task status" });
    }
  }

  async function handleDeleteTask(taskId) {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ variant: "success", message: "Task deleted successfully!" });
        setDeletingTaskId(null);
        await loadTasks();
      } else {
        addToast({ variant: "error", message: data.message || "Failed to delete task" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Network error deleting task" });
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleReview(completionId, action) {
    setReviewingId(completionId);
    try {
      const res = await fetch("/api/admin/tasks/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({ completionId, action }),
      });

      const data = await res.json();
      if (data.success) {
        addToast({
          variant: "success",
          message:
            action === "VERIFIED"
              ? "Completion approved! TERR reward granted."
              : "Completion rejected.",
        });
        await loadCompletions();
      } else {
        addToast({ variant: "error", message: data.message || "Review failed" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Network error" });
    } finally {
      setReviewingId(null);
    }
  }

  const pendingCount = pendingCompletions.length;

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-10 w-48" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl title text-text-primary">Task Management</h1>
          <p className="text-sm stitle text-text-tertiary mt-1">
            Create and edit tasks, configure verification methods, upload OG images, and review completions.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
            setActiveTab("tasks");
          }}
          className="cta"
        >
          <PlusSignIcon size={16} className="mr-1.5 inline-block" />
          Create Task
        </Button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-1 border-b border-border-primary">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "tasks"
              ? "border-accent text-accent"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Tasks ({tasks.length})
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors relative ${
            activeTab === "review"
              ? "border-accent text-accent"
              : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Pending Review
          {completionFilter === "PENDING" && pendingCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-error text-white rounded-full">
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* ===== Tasks Tab ===== */}
      {activeTab === "tasks" && (
        <>
          {/* Create/Edit Form */}
          {showCreateForm && (
            <Card className="shadow-lg border border-border-secondary">
              <Card.Header>
                <h2 className="text-md title text-text-primary flex items-center justify-between">
                  <span>{editingTask ? "Edit Task" : "Create New Task"}</span>
                  <span className="text-xs text-text-tertiary font-normal">
                    {editingTask ? `ID: ${editingTask}` : "New Entry"}
                  </span>
                </h2>
              </Card.Header>
              <Card.Body className="space-y-5">
                <Input
                  label="Task Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g., Join Official Teron Telegram Channel"
                />

                <div className="space-y-2">
                  <label className="input-label">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe what the user needs to do to earn this reward..."
                    className="input"
                    rows={3}
                    style={{ height: "auto" }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className="input-label">Verification Method</label>
                    <select
                      value={form.verificationMethod}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({
                          ...form,
                          verificationMethod: val,
                          category: val === "MANUAL_TELEGRAM" ? "TELEGRAM" : form.category,
                        });
                      }}
                      className="input"
                    >
                      {VERIFICATION_METHODS.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="input-label">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="input"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Input
                    label="TERR Reward"
                    type="number"
                    value={form.rewardAmount}
                    onChange={(e) => setForm({ ...form, rewardAmount: e.target.value })}
                    min={0}
                    max={10000}
                  />
                </div>

                <Input
                  label="External URL (optional)"
                  value={form.externalUrl}
                  onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                  placeholder="https://t.me/teronprotocol or https://x.com/teronapp"
                  helperText="Link the user visits when clicking 'Visit & Complete'"
                />

                {/* Task OG Image / Thumbnail Section */}
                <div className="p-4 rounded-xl bg-surface-secondary border border-border-secondary space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="input-label mb-0 flex items-center gap-1.5 text-text-primary">
                      <Image01Icon size={16} className="text-accent" />
                      Task OG Thumbnail Image
                    </label>
                    <span className="text-[11px] font-mono text-accent font-semibold">
                      Recommended: 1200 × 630 px
                    </span>
                  </div>

                  {/* Dimensions Guide Box */}
                  <div className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-tertiary border border-border-primary text-xs text-text-secondary">
                    <AlertCircleIcon size={16} className="text-text-tertiary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-text-primary">Social OG & Card Specifications</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        Upload a landscape <strong>1200 × 630 px (1.91:1 ratio)</strong> image (min 600×315 px, max 5MB).
                        This image appears as the card banner and dynamic OpenGraph preview on X (Twitter) & Telegram.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileChange}
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      isLoading={isUploadingImage}
                      className="card text-white shrink-0"
                    >
                      <Upload04Icon size={14} className="mr-1.5 inline-block" />
                      Upload 1200×630 Image
                    </Button>

                    <span className="text-xs text-text-tertiary">or paste image URL:</span>

                    <input
                      type="url"
                      value={form.imageUrl}
                      onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="https://.../task-banner.png"
                      className="input flex-1 text-xs py-1.5"
                    />
                  </div>

                  {/* Image Preview */}
                  {form.imageUrl && (
                    <div className="relative rounded-lg overflow-hidden border border-border-primary w-full max-w-sm aspect-[1.91/1] bg-surface-tertiary mt-2 group">
                      <img
                        src={form.imageUrl}
                        alt="Task Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: "" })}
                        className="absolute top-2 right-2 bg-black/70 hover:bg-error text-white p-1 rounded-md text-xs transition-colors"
                        title="Remove Image"
                      >
                        <Cancel01Icon size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm({ ...form, active: e.target.checked })}
                    className="w-4 h-4 accent-[var(--color-accent)]"
                    id="task-active"
                  />
                  <label htmlFor="task-active" className="text-sm text-text-secondary cursor-pointer">
                    Active (visible in Task Center for users)
                  </label>
                </div>
              </Card.Body>
              <Card.Footer className="flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={resetForm} className="card text-white">
                  Cancel
                </Button>
                <Button onClick={handleSave} isLoading={isSaving} className="cta">
                  {editingTask ? "Save Changes" : "Create Task"}
                </Button>
              </Card.Footer>
            </Card>
          )}

          {/* Delete Confirmation Modal */}
          {deletingTaskId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
              <Card className="max-w-md w-full shadow-2xl border border-error/30 animate-in fade-in zoom-in-95 duration-150">
                <Card.Header>
                  <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Delete02Icon className="text-error" size={20} />
                    Delete Task
                  </h3>
                </Card.Header>
                <Card.Body className="space-y-3">
                  <p className="text-sm text-text-secondary">
                    Are you sure you want to permanently delete this task?
                  </p>
                  <p className="text-xs text-text-tertiary bg-surface-secondary p-3 rounded-lg border border-border-primary">
                    This will remove the task and all associated completion records. This action cannot be undone.
                  </p>
                </Card.Body>
                <Card.Footer className="flex items-center justify-end gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => setDeletingTaskId(null)}
                    className="card text-white"
                    disabled={isDeleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDeleteTask(deletingTaskId)}
                    isLoading={isDeleting}
                    className="bg-error hover:bg-error/90 text-white font-semibold"
                  >
                    Delete Permanently
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          )}

          {/* Tasks List */}
          {tasks.length === 0 ? (
            <Card>
              <Card.Body className="py-16 text-center">
                <p className="text-text-primary font-semibold">No tasks created yet</p>
                <p className="text-text-secondary text-xs mt-1.5">
                  Click &quot;Create Task&quot; above to add community and Telegram quests.
                </p>
              </Card.Body>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="transition-all hover:border-border-secondary">
                  <Card.Body className="p-5">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      {/* Left: Thumbnail + Task Details */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {task.imageUrl ? (
                          <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-border-primary bg-surface-tertiary">
                            <img
                              src={task.imageUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-surface-secondary flex items-center justify-center shrink-0 border border-border-primary">
                            {task.verificationMethod === "MANUAL_TELEGRAM" ? (
                              <TelegramIcon size={22} className="text-[#0088cc]" />
                            ) : (
                              <Image01Icon size={20} className="text-text-tertiary" />
                            )}
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h3 className="font-bold text-text-primary title text-sm">
                              {task.title}
                            </h3>
                            <Badge variant={task.active ? "success" : "neutral"} size="sm">
                              {task.active ? "Active" : "Inactive"}
                            </Badge>
                            <Badge
                              variant={
                                task.verificationMethod === "MANUAL_TELEGRAM"
                                  ? "accent"
                                  : task.verificationMethod === "LINK_CHECK"
                                  ? "info"
                                  : "neutral"
                              }
                              size="sm"
                            >
                              {task.verificationMethod === "MANUAL_TELEGRAM"
                                ? "TG Manual Review"
                                : task.verificationMethod.replace("_", " ")}
                            </Badge>
                            {task.category && (
                              <Badge variant="neutral" size="sm" className="opacity-80">
                                {task.category}
                              </Badge>
                            )}
                          </div>

                          <p className="text-xs text-text-secondary line-clamp-2 mb-2">
                            {task.description}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-text-tertiary flex-wrap">
                            <span className="font-bold text-accent">+{task.rewardAmount} TERR</span>
                            <span>{task._count?.completions || 0} completions</span>
                            {task.externalUrl && (
                              <a
                                href={task.externalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent hover:underline inline-flex items-center gap-1 truncate max-w-[220px]"
                              >
                                <LinkSquare02Icon size={12} />
                                {task.externalUrl}
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                        <button
                          onClick={() => startEdit(task)}
                          className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                          title="Edit Task"
                        >
                          <Edit02Icon size={16} />
                        </button>

                        <button
                          onClick={() => toggleActive(task)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            task.active
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-surface-secondary text-text-tertiary hover:bg-surface-tertiary"
                          }`}
                          title={task.active ? "Deactivate" : "Activate"}
                        >
                          {task.active ? (
                            <CheckmarkCircle03Icon size={16} variant="solid" />
                          ) : (
                            <Cancel01Icon size={16} />
                          )}
                        </button>

                        {/* Delete Task Button (Highlighted especially for deactivated tasks) */}
                        <button
                          onClick={() => setDeletingTaskId(task.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            !task.active
                              ? "bg-error/10 text-error hover:bg-error/20"
                              : "bg-surface-secondary text-text-tertiary hover:text-error hover:bg-error/10"
                          }`}
                          title={!task.active ? "Delete Deactivated Task" : "Delete Task"}
                        >
                          <Delete02Icon size={16} />
                        </button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== Pending Review Tab ===== */}
      {activeTab === "review" && (
        <>
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            {["PENDING", "VERIFIED", "REJECTED"].map((status) => (
              <button
                key={status}
                onClick={() => setCompletionFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  completionFilter === status
                    ? status === "PENDING"
                      ? "bg-warning/10 text-warning border border-warning/20"
                      : status === "VERIFIED"
                      ? "bg-success/10 text-success border border-success/20"
                      : "bg-error/10 text-error border border-error/20"
                    : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary border border-transparent"
                }`}
              >
                {status === "PENDING" && <Time02Icon size={14} className="inline-block mr-1.5 -mt-0.5" />}
                {status === "VERIFIED" && <CheckmarkBadge01Icon size={14} className="inline-block mr-1.5 -mt-0.5" />}
                {status === "REJECTED" && <Cancel01Icon size={14} className="inline-block mr-1.5 -mt-0.5" />}
                {status}
              </button>
            ))}
          </div>

          {isLoadingCompletions ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : pendingCompletions.length === 0 ? (
            <Card>
              <Card.Body className="py-16 text-center">
                <Time02Icon size={40} className="mx-auto text-text-tertiary opacity-30 mb-4" />
                <p className="text-text-primary font-semibold">
                  No {completionFilter.toLowerCase()} completions
                </p>
                <p className="text-text-secondary text-xs mt-1.5">
                  {completionFilter === "PENDING"
                    ? "All task completions have been reviewed. You're all caught up!"
                    : `No completions with status "${completionFilter}" found.`}
                </p>
              </Card.Body>
            </Card>
          ) : (
            <div className="space-y-3">
              {pendingCompletions.map((completion) => {
                const tgHandle =
                  completion.telegramUsername || completion.user?.telegram || null;
                const cleanTg = tgHandle ? tgHandle.replace(/^@/, "") : null;

                return (
                  <Card key={completion.id}>
                    <Card.Body className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        {/* Left: User + Task info */}
                        <div className="flex-1 min-w-0 space-y-3">
                          {/* User info */}
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-surface-tertiary border border-border-secondary flex items-center justify-center overflow-hidden shrink-0">
                              {completion.user?.avatar ? (
                                <img
                                  src={completion.user.avatar}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-[10px] font-bold text-accent font-mono">
                                  {completion.user?.walletAddress?.slice(2, 4).toUpperCase() || "??"}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-text-primary truncate">
                                {completion.user?.displayName ||
                                  `${completion.user?.walletAddress?.slice(0, 6)}...${completion.user?.walletAddress?.slice(-4)}`}
                              </p>
                              <p className="text-[10px] font-mono text-text-tertiary truncate">
                                {completion.user?.walletAddress}
                              </p>
                            </div>
                          </div>

                          {/* Task info */}
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="neutral" size="sm">
                              {completion.task?.title}
                            </Badge>
                            <Badge
                              variant={
                                completion.task?.verificationMethod === "MANUAL_TELEGRAM"
                                  ? "accent"
                                  : completion.task?.verificationMethod === "MANUAL"
                                  ? "warning"
                                  : "neutral"
                              }
                              size="sm"
                            >
                              {completion.task?.verificationMethod === "MANUAL_TELEGRAM"
                                ? "TG Manual Review"
                                : completion.task?.verificationMethod?.replace("_", " ")}
                            </Badge>
                            <span className="text-xs font-bold text-accent">
                              +{completion.task?.rewardAmount} TERR
                            </span>
                          </div>

                          {/* Telegram Username Verification Field */}
                          {tgHandle && (
                            <div className="p-2.5 rounded-lg bg-[#0088cc]/10 border border-[#0088cc]/20 flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <TelegramIcon size={18} className="text-[#0088cc]" />
                                <span className="text-xs text-text-secondary font-medium">
                                  Submitted Telegram:
                                </span>
                                <span className="text-xs font-mono font-bold text-white">
                                  @{cleanTg}
                                </span>
                              </div>
                              <a
                                href={`https://t.me/${cleanTg}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 rounded bg-[#0088cc] hover:bg-[#0088cc]/80 text-white text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                              >
                                Open in Telegram ↗
                              </a>
                            </div>
                          )}

                          {/* Proof */}
                          {completion.proof && (
                            <div className="mt-1">
                              <p className="text-[10px] text-text-tertiary font-semibold uppercase tracking-wider mb-1">
                                Proof
                              </p>
                              <p className="text-xs text-text-secondary bg-surface-secondary rounded-lg px-3 py-2 break-all">
                                {completion.proof.startsWith("http") ? (
                                  <a
                                    href={completion.proof}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent hover:underline"
                                  >
                                    {completion.proof}
                                  </a>
                                ) : (
                                  completion.proof
                                )}
                              </p>
                            </div>
                          )}

                          <p className="text-[10px] text-text-tertiary">
                            Submitted {new Date(completion.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* Right: Actions */}
                        {completionFilter === "PENDING" && (
                          <div className="flex items-center gap-2 shrink-0 sm:flex-col">
                            <button
                              onClick={() => handleReview(completion.id, "VERIFIED")}
                              disabled={reviewingId === completion.id}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-success/10 text-success border border-success/20 text-xs font-semibold hover:bg-success/20 transition-colors disabled:opacity-50"
                            >
                              <CheckmarkCircle03Icon size={14} variant="solid" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReview(completion.id, "REJECTED")}
                              disabled={reviewingId === completion.id}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-error/10 text-error border border-error/20 text-xs font-semibold hover:bg-error/20 transition-colors disabled:opacity-50"
                            >
                              <Cancel01Icon size={14} />
                              Reject
                            </button>
                          </div>
                        )}

                        {completionFilter === "VERIFIED" && (
                          <Badge variant="success" size="sm">
                            <CheckmarkBadge01Icon size={12} className="mr-1 inline-block" />
                            Approved
                          </Badge>
                        )}

                        {completionFilter === "REJECTED" && (
                          <Badge variant="error" size="sm">
                            <Cancel01Icon size={12} className="mr-1 inline-block" />
                            Rejected
                          </Badge>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
