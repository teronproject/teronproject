"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import Input from "@/components/ui/Input";
import {
  PlusSignIcon,
  CheckmarkCircle03Icon,
  Cancel01Icon,
  Edit02Icon,
} from "hugeicons-react";

const VERIFICATION_METHODS = [
  { value: "LINK_CHECK", label: "Link Check (Auto-verify)" },
  { value: "SOCIAL_FOLLOW", label: "Social Follow (Manual)" },
  { value: "MANUAL", label: "Manual Verification" },
  { value: "REFERRAL", label: "Referral" },
];

export default function AdminTasksPage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: "",
    description: "",
    verificationMethod: "LINK_CHECK",
    rewardAmount: 10,
    externalUrl: "",
    active: true,
  });

  useEffect(() => {
    loadTasks();
  }, []);

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

  function resetForm() {
    setForm({
      title: "",
      description: "",
      verificationMethod: "LINK_CHECK",
      rewardAmount: 10,
      externalUrl: "",
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
      active: task.active,
    });
    setShowCreateForm(true);
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
          active: form.active,
        }),
      });

      const data = await res.json();
      if (data.success) {
        addToast({
          variant: "success",
          message: isUpdate ? "Task updated!" : "Task created!",
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
      addToast({ variant: "error", message: "Failed to toggle" });
    }
  }

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl title text-text-primary">Task Management</h1>
          <p className="text-sm stitle text-text-tertiary mt-1">
            Create and manage community tasks. Users earn TERR for completing them.
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
          className="cta"
        >
          <PlusSignIcon size={16} className="mr-1.5" />
          Create Task
        </Button>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <Card className="shadow-lg">
          <Card.Header>
            <h2 className="text-md title text-text-primary">
              {editingTask ? "Edit Task" : "Create New Task"}
            </h2>
          </Card.Header>
          <Card.Body className="space-y-5">
            <Input
              label="Task Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Follow Teron on X"
            />

            <div className="space-y-2">
              <label className="input-label">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe what the user needs to do..."
                className="input"
                rows={3}
                style={{ height: "auto" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="input-label">Verification Method</label>
                <select
                  value={form.verificationMethod}
                  onChange={(e) => setForm({ ...form, verificationMethod: e.target.value })}
                  className="input"
                >
                  {VERIFICATION_METHODS.map((m) => (
                    <option key={m.value} value={m.value}>{m.label}</option>
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
              placeholder="https://x.com/teronprotocol"
              helperText="Link the user needs to visit for LINK_CHECK / SOCIAL_FOLLOW tasks"
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4 accent-[var(--color-accent)]"
                id="task-active"
              />
              <label htmlFor="task-active" className="text-sm text-text-secondary">
                Active (visible to users)
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

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Card>
          <Card.Body className="py-16 text-center">
            <p className="text-text-primary font-semibold">No tasks created yet</p>
            <p className="text-text-secondary text-xs mt-1.5">
              Click "Create Task" to get started.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <Card.Body className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-text-primary title text-sm">
                        {task.title}
                      </h3>
                      <Badge variant={task.active ? "success" : "neutral"} size="sm">
                        {task.active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {task.verificationMethod.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-1 mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-text-tertiary">
                      <span className="font-bold text-accent">+{task.rewardAmount} TERR</span>
                      <span>{task._count?.completions || 0} completions</span>
                      {task.externalUrl && (
                        <a href={task.externalUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline truncate max-w-[200px]">
                          {task.externalUrl}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(task)}
                      className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                      title="Edit"
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
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
