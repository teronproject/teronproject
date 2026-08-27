"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import posthog from "posthog-js";
import {
  CheckmarkCircle03Icon,
  Time02Icon,
  Cancel01Icon,
  LinkSquare02Icon,
  UserMultiple02Icon,
  Share08Icon,
  Coins01Icon,
  Task01Icon,
  TelegramIcon,
  Copy01Icon,
  CheckmarkBadge01Icon,
} from "hugeicons-react";
import Image from "next/image";

export default function TasksPage() {
  const { address, isConnected } = useWallet();
  const { addToast } = useToastContext();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [referralCode, setReferralCode] = useState("");

  // Modals state
  const [telegramModalTask, setTelegramModalTask] = useState(null);
  const [telegramInput, setTelegramInput] = useState("");
  const [shareModalTask, setShareModalTask] = useState(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    loadTasks();
    if (address) {
      loadUserData();
    }
  }, [address]);

  async function loadUserData() {
    try {
      const [profRes, refRes] = await Promise.all([
        fetch("/api/auth/profile", { headers: { "x-wallet-address": address } }),
        fetch("/api/referrals", { headers: { "x-wallet-address": address } }),
      ]);

      if (profRes.ok) {
        const profData = await profRes.json();
        if (profData.success && profData.user) {
          setUserProfile(profData.user);
          if (profData.user.telegram) {
            setTelegramInput(profData.user.telegram);
          }
        }
      }

      if (refRes.ok) {
        const refData = await refRes.json();
        if (refData.success && refData.referralCode) {
          setReferralCode(refData.referralCode);
        }
      }
    } catch (e) {
      console.error("Failed to load user profile for tasks:", e);
    }
  }

  async function loadTasks() {
    try {
      const res = await fetch("/api/tasks/list", {
        headers: address ? { "x-wallet-address": address } : {},
      });
      const data = await res.json();
      if (data.success) setTasks(data.tasks);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleTaskAction(task) {
    if (!isConnected || !address) {
      addToast({ variant: "warning", message: "Connect your wallet first" });
      return;
    }

    const isTg =
      task.verificationMethod === "MANUAL_TELEGRAM" || task.requiresTelegram === true;

    if (isTg) {
      // Open Telegram username modal
      setTelegramInput(userProfile?.telegram || "");
      setTelegramModalTask(task);
    } else {
      // Direct complete / link check
      submitTaskCompletion(task.id, task.externalUrl, task, null);
    }
  }

  async function submitTaskCompletion(taskId, externalUrl, task, telegramHandle) {
    if (externalUrl) {
      window.open(externalUrl, "_blank", "noopener,noreferrer");
    }

    setCompletingId(taskId);
    try {
      const res = await fetch("/api/tasks/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({
          taskId,
          telegramUsername: telegramHandle || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const status = data.completion?.status;
        posthog.capture("task_completion_submitted", {
          completion_status: status,
          reward_amount: task.rewardAmount,
          verification_method: task.verificationMethod,
          has_telegram: !!telegramHandle,
        });

        if (status === "VERIFIED") {
          addToast({ variant: "success", message: "Task completed! TERR reward earned 🎉" });
        } else {
          addToast({
            variant: "info",
            message: "Task submitted! Pending admin verification.",
          });
        }
        setTelegramModalTask(null);
        await loadTasks();
      } else {
        addToast({ variant: "error", message: data.message || "Failed to complete task" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Network error. Please try again." });
    } finally {
      setCompletingId(null);
    }
  }

  function handleTelegramSubmit(e) {
    e.preventDefault();
    if (!telegramInput.trim()) {
      addToast({ variant: "error", message: "Please enter your Telegram username" });
      return;
    }
    if (!telegramModalTask) return;

    submitTaskCompletion(
      telegramModalTask.id,
      telegramModalTask.externalUrl,
      telegramModalTask,
      telegramInput.trim()
    );
  }

  function getShareUrl(taskId) {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://www.teron.io";
    const refParam = referralCode ? `?ref=${referralCode}` : "";
    return `${origin}/tasks/${taskId}${refParam}`;
  }

  function handleShareTwitter(task) {
    const shareUrl = getShareUrl(task.id);
    const text = encodeURIComponent(
      `Complete the quest "${task.title}" and earn +${task.rewardAmount} $TERR on @teronapp! 🚀 Join the BNB Chain community quest 👇`
    );
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
    posthog.capture("task_shared", { platform: "twitter", taskId: task.id });
  }

  function handleShareTelegram(task) {
    const shareUrl = getShareUrl(task.id);
    const text = encodeURIComponent(
      `Earn +${task.rewardAmount} TERR by completing "${task.title}" on Teron Protocol! 🚀 Check it out:`
    );
    const url = encodeURIComponent(shareUrl);
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, "_blank");
    posthog.capture("task_shared", { platform: "telegram", taskId: task.id });
  }

  function handleCopyShareLink(task) {
    const shareUrl = getShareUrl(task.id);
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    addToast({ variant: "success", message: "Quest link copied with your referral code!" });
    setTimeout(() => setCopiedLink(false), 2000);
    posthog.capture("task_shared", { platform: "copy_link", taskId: task.id });
  }

  function getStatusBadge(completion) {
    if (!completion) return null;
    switch (completion.status) {
      case "VERIFIED":
        return (
          <Badge variant="success" size="sm" className="shadow-sm">
            <CheckmarkCircle03Icon size={12} className="mr-1" variant="solid" />
            Completed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge variant="warning" size="sm" className="shadow-sm">
            <Time02Icon size={12} className="mr-1" variant="solid" />
            Pending Review
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="error" size="sm" className="shadow-sm">
            <Cancel01Icon size={12} className="mr-1" variant="solid" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  }

  function getMethodIcon(method, requiresTelegram) {
    if (method === "MANUAL_TELEGRAM" || requiresTelegram) {
      return <TelegramIcon size={18} className="text-[#0088cc]" />;
    }
    switch (method) {
      case "LINK_CHECK":
        return <LinkSquare02Icon size={18} className="text-info" variant="stroke-rounded" />;
      case "SOCIAL_FOLLOW":
        return <Share08Icon size={18} className="text-accent" variant="stroke-rounded" />;
      case "REFERRAL":
        return <UserMultiple02Icon size={18} className="text-success" variant="stroke-rounded" />;
      default:
        return <Task01Icon size={18} className="text-text-tertiary" variant="stroke-rounded" />;
    }
  }

  function getMethodLabel(method, requiresTelegram) {
    if (method === "MANUAL_TELEGRAM" || requiresTelegram) return "Telegram Quest";
    switch (method) {
      case "LINK_CHECK":
        return "Visit Link";
      case "SOCIAL_FOLLOW":
        return "Social Action";
      case "REFERRAL":
        return "Referral";
      case "MANUAL":
        return "Manual Verify";
      default:
        return method;
    }
  }

  // Filter tasks based on category
  const filteredTasks = tasks.filter((task) => {
    if (activeCategory === "ALL") return true;
    if (activeCategory === "TELEGRAM") {
      return (
        task.verificationMethod === "MANUAL_TELEGRAM" ||
        task.requiresTelegram ||
        task.category === "TELEGRAM"
      );
    }
    if (activeCategory === "COMPLETED") {
      return task.userCompletion?.status === "VERIFIED";
    }
    return task.category === activeCategory;
  });

  const totalEarned = tasks
    .filter((t) => t.userCompletion?.status === "VERIFIED")
    .reduce((sum, t) => sum + t.rewardAmount, 0);

  const completedCount = tasks.filter((t) => t.userCompletion?.status === "VERIFIED").length;

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl title text-text-primary flex items-center gap-3">
            Task Center
          </h1>
          <p className="text-sm text-balance text-text-tertiary mt-1.5 max-w-2xl">
            Complete quests, join official channels, and share tasks with friends to earn TERR rewards.
          </p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border border-border-secondary">
          <Card.Body className="p-5 text-center">
            <p className="text-2xl title font-extrabold text-text-primary">{tasks.length}</p>
            <p className="text-xs stitle text-text-tertiary mt-1">Available Quests</p>
          </Card.Body>
        </Card>
        <Card className="border border-border-secondary">
          <Card.Body className="p-5 text-center">
            <p className="text-2xl title font-extrabold text-success">{completedCount}</p>
            <p className="text-xs stitle text-text-tertiary mt-1">Completed Quests</p>
          </Card.Body>
        </Card>
        <Card className="border border-border-secondary">
          <Card.Body className="p-5 text-center">
            <p className="text-2xl title font-extrabold text-accent flex items-center justify-center gap-1.5">
              <Coins01Icon size={22} variant="solid" />
              {totalEarned} TERR
            </p>
            <p className="text-xs stitle text-text-tertiary mt-1">Total Earned</p>
          </Card.Body>
        </Card>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "ALL", label: `All Quests (${tasks.length})` },
          { id: "TELEGRAM", label: "Telegram Quests" },
          { id: "COMMUNITY", label: "Community" },
          { id: "COMPLETED", label: `Completed (${completedCount})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveCategory(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategory === tab.id
                ? "bg-accent text-accent-text shadow-sm"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-border-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <Card>
          <Card.Body className="py-16 text-center">
            <Task01Icon
              size={48}
              className="mx-auto text-text-tertiary opacity-30 mb-4"
              variant="stroke-rounded"
            />
            <p className="text-text-primary font-semibold text-sm">No tasks in this category</p>
            <p className="text-text-secondary text-xs mt-1.5">
              Check back soon for new community rewards and Telegram quests!
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isCompleted = task.userCompletion?.status === "VERIFIED";
            const isPending = task.userCompletion?.status === "PENDING";
            const isRejected = task.userCompletion?.status === "REJECTED";
            const canComplete = !isCompleted && !isPending;
            const isTg =
              task.verificationMethod === "MANUAL_TELEGRAM" || task.requiresTelegram;

            return (
              <Card
                key={task.id}
                className={`overflow-hidden transition-all duration-200 hover:border-border-secondary flex flex-col justify-between ${
                  isCompleted ? "opacity-75" : ""
                }`}
              >
                {/* Task OG Thumbnail Header (if uploaded) */}
                {task.imageUrl && (
                  <div className="w-full aspect-[1.91/1] overflow-hidden bg-surface-tertiary relative border-b border-border-primary">
                    <img
                      src={task.imageUrl}
                      alt={task.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center  gap-1.5 bg-black/80 backdrop-blur-md text-accent px-2 py-1.5 rounded-lg border border-accent/30 shadow-lg">
                      <Image
                      src="/32.svg"
                      alt="Coins01Icon"
                      width={16}
                      height={16}
                        />
                        {/* <Coins01Icon size={14} variant="solid" /> */}
                        <span className="font-bold text-xs">+{task.rewardAmount} TERR</span>
                      </div>
                    </div>
                    {isTg && (
                      <div className="absolute top-3 left-3 bg-[#0088cc]/90 text-white backdrop-blur-md text-[11px] font-semibold px-2.5 py-1 rounded-md shadow flex items-center gap-1">
                        <TelegramIcon size={14} />
                        Telegram Quest
                      </div>
                    )}
                  </div>
                )}

                <Card.Body className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* Top Row: Icon + Title + Status */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {!task.imageUrl && (
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                              isCompleted
                                ? "bg-success/10 border-success/20"
                                : isTg
                                ? "bg-[#0088cc]/10 border-[#0088cc]/20"
                                : "bg-surface-secondary border-border-primary"
                            }`}
                          >
                            {isCompleted ? (
                              <CheckmarkCircle03Icon size={20} className="text-success" variant="solid" />
                            ) : (
                              getMethodIcon(task.verificationMethod, task.requiresTelegram)
                            )}
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-text-primary title text-sm line-clamp-1">
                            {task.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                              {getMethodLabel(task.verificationMethod, task.requiresTelegram)}
                            </span>
                            <span className="text-[11px] text-text-tertiary flex items-center gap-1">
                              • <UserMultiple02Icon size={12} /> {task.totalCompletions} completed
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Reward Pill (shown here if no image) */}
                      {!task.imageUrl && (
                        <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-2.5 py-1 rounded-lg shrink-0 border border-accent/20">
                          <Coins01Icon size={14} variant="solid" />
                          <span className="font-bold text-xs">+{task.rewardAmount} TERR</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                      {task.description}
                    </p>

                    {/* Pending Verification Notice */}
                    {isPending && (
                      <div className="p-2.5 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs flex items-center gap-2">
                        <Time02Icon size={14} className="shrink-0" />
                        <span>Submitted! Admin is verifying your entry.</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-border-primary flex items-center justify-between gap-3">
                    <div>{getStatusBadge(task.userCompletion)}</div>

                    <div className="flex items-center gap-2">
                      {/* Social Share Button */}
                      <button
                        type="button"
                        onClick={() => setShareModalTask(task)}
                        className="h-9 px-3 rounded-lg bg-surface-secondary hover:bg-surface-tertiary text-text-secondary hover:text-text-primary text-xs font-semibold inline-flex items-center gap-1.5 transition-colors border border-border-primary"
                        title="Share this task with friends"
                      >
                        <Share08Icon size={14} />
                        Share
                      </button>

                      {canComplete && (
                        <Button
                          size="sm"
                          onClick={() => handleTaskAction(task)}
                          isLoading={completingId === task.id}
                          disabled={!isConnected}
                          className="cta"
                        >
                          {isTg
                            ? "Complete & Enter TG"
                            : task.externalUrl
                            ? "Visit & Complete"
                            : "Complete Task"}
                        </Button>
                      )}

                      {isRejected && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleTaskAction(task)}
                          isLoading={completingId === task.id}
                          className="card text-white"
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </div>
      )}

      {/* Telegram Username Verification Modal */}
      {telegramModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <Card className="max-w-md w-full shadow-2xl border border-[#0088cc]/30 bg-surface-primary">
            <Card.Header>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0088cc]/20 flex items-center justify-center text-[#0088cc]">
                    <TelegramIcon size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-text-primary">Telegram Verification</h3>
                    <p className="text-[11px] text-text-tertiary">Admins verify your participation.</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-accent px-2.5 py-1 rounded-md bg-accent/10">
                  +{telegramModalTask.rewardAmount} TERR
                </div>
              </div>
            </Card.Header>

            <form onSubmit={handleTelegramSubmit}>
              <Card.Body className="space-y-5">
                <div className="space-y-2">
                  <label className="input-label text-sm">
                    1. Enter your Telegram Username (@handle)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={telegramInput}
                      onChange={(e) => setTelegramInput(e.target.value)}
                      placeholder="@yourusername"
                      required
                      className="input w-full font-mono text-sm pl-3"
                    />
                  </div>
                  <p className="text-[11px] text-text-tertiary">
                    Required for admins to verify your participation.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-secondary border border-border-primary space-y-2">
                  <p className="text-xs font-bold text-text-primary">
                    2. Start Quest & Submit
                  </p>
                  <p className="text-[11px] text-text-tertiary leading-relaxed">
                    Once you've entered your handle, click Start. This will open the Telegram community and automatically submit your username for admin review.
                  </p>
                </div>
              </Card.Body>

              <Card.Footer className="flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setTelegramModalTask(null)}
                  className="card text-white text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={completingId === telegramModalTask.id}
                  disabled={!telegramInput.trim()}
                  className="cta text-xs"
                >
                  Start Quest & Verify
                </Button>
              </Card.Footer>
            </form>
          </Card>
        </div>
      )}

      {/* Creative Social Share Modal */}
      {shareModalTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <Card className="max-w-lg w-full shadow-2xl border border-border-secondary bg-surface-primary">
            <Card.Header>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <Share08Icon size={18} className="text-accent" />
                  Share Quest & Earn Together
                </h3>
                <button
                  onClick={() => setShareModalTask(null)}
                  className="text-text-tertiary hover:text-white p-1"
                >
                  ✕
                </button>
              </div>
            </Card.Header>

            <Card.Body className="space-y-4">
              {/* Task Preview */}
              <div className="p-4 rounded-xl bg-surface-secondary border border-border-primary space-y-3">
                {shareModalTask.imageUrl && (
                  <div className="w-full aspect-[1.91/1] rounded-lg overflow-hidden border border-border-secondary">
                    <img
                      src={shareModalTask.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-text-primary text-sm">{shareModalTask.title}</h4>
                    <span className="text-xs font-bold text-accent">
                      +{shareModalTask.rewardAmount} TERR
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                    {shareModalTask.description}
                  </p>
                </div>
              </div>

              {referralCode && (
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-xs text-text-secondary">
                  <span className="font-bold text-accent">🎁 Referral Bonus:</span> Your referral code{" "}
                  <code className="font-mono font-bold text-white bg-black/40 px-1.5 py-0.5 rounded">
                    {referralCode}
                  </code>{" "}
                  is attached. You earn extra referral rewards when your friends join!
                </div>
              )}

              {/* Share Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleShareTwitter(shareModalTask)}
                  className="py-3 px-4 rounded-xl bg-black hover:bg-black/80 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 border border-white/20 transition-all hover:scale-[1.02]"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Share to X (Twitter)
                </button>

                <button
                  type="button"
                  onClick={() => handleShareTelegram(shareModalTask)}
                  className="py-3 px-4 rounded-xl bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-semibold text-xs inline-flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <TelegramIcon size={18} />
                  Share to Telegram
                </button>
              </div>

              {/* Copy Link Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-text-tertiary uppercase">
                  Quest Share Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl(shareModalTask.id)}
                    className="input text-xs font-mono flex-1 bg-surface-secondary py-2"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleCopyShareLink(shareModalTask)}
                    className={copiedLink ? "bg-success text-white" : "cta p-5"}
                  >
                    {copiedLink ? (
                      <>
                        <CheckmarkBadge01Icon size={14} className="mr-1 inline-block" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy01Icon size={14} className="mr-1 inline-block" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}
