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
} from "hugeicons-react";

export default function TasksPage() {
  const { address, isConnected } = useWallet();
  const { addToast } = useToastContext();
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [address]);

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

  async function handleComplete(taskId, externalUrl, task) {
    if (!isConnected || !address) {
      addToast({ variant: "warning", message: "Connect your wallet first" });
      return;
    }

    // If task has an external URL, open it first
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
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json();
      if (data.success) {
        const status = data.completion?.status;
        posthog.capture("task_completion_submitted", {
          completion_status: status,
          reward_amount: task.rewardAmount,
          verification_method: task.verificationMethod,
        });
        if (status === "VERIFIED") {
          addToast({ variant: "success", message: "Task completed! TERR reward earned 🎉" });
        } else {
          addToast({ variant: "info", message: "Task submitted! Pending admin verification." });
        }
        await loadTasks(); // Refresh list
      } else {
        addToast({ variant: "error", message: data.message || "Failed to complete task" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Network error. Please try again." });
    } finally {
      setCompletingId(null);
    }
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

  function getMethodIcon(method) {
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

  function getMethodLabel(method) {
    switch (method) {
      case "LINK_CHECK": return "Visit Link";
      case "SOCIAL_FOLLOW": return "Social Action";
      case "REFERRAL": return "Referral";
      case "MANUAL": return "Manual Verify";
      default: return method;
    }
  }

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
      <div>
        <h1 className="text-2xl title text-text-primary flex items-center gap-3">
          Task Center
        </h1>
        <p className="text-sm text-balance text-text-tertiary mt-2 max-w-2xl">
          Complete tasks to earn TERR reward tokens. Follow social channels, visit links, and refer friends to grow your balance.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <Card.Body className="p-5 text-center">
            <p className="text-2xl title font-extrabold text-text-primary">{tasks.length}</p>
            <p className="text-xs stitle text-text-tertiary mt-1">Available Tasks</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-5 text-center">
            <p className="text-2xl title font-extrabold text-success">
              {tasks.filter(t => t.userCompletion?.status === "VERIFIED").length}
            </p>
            <p className="text-xs stitle text-text-tertiary mt-1">Completed</p>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body className="p-5 text-center">
            <p className="text-2xl title font-extrabold text-accent">
              {tasks
                .filter(t => t.userCompletion?.status === "VERIFIED")
                .reduce((sum, t) => sum + t.rewardAmount, 0)} TERR
            </p>
            <p className="text-xs stitle text-text-tertiary mt-1">Earned</p>
          </Card.Body>
        </Card>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <Card>
          <Card.Body className="py-16 text-center">
            <Task01Icon size={48} className="mx-auto text-text-tertiary opacity-30 mb-4" variant="stroke-rounded" />
            <p className="text-text-primary font-semibold text-sm">No tasks available yet</p>
            <p className="text-text-secondary text-xs mt-1.5">
              New tasks will appear here when the admin creates them. Check back soon!
            </p>
          </Card.Body>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const isCompleted = task.userCompletion?.status === "VERIFIED";
            const isPending = task.userCompletion?.status === "PENDING";
            const isRejected = task.userCompletion?.status === "REJECTED";
            const canComplete = !isCompleted && !isPending;

            return (
              <Card key={task.id} className={`transition-all ${isCompleted ? "opacity-70" : ""}`}>
                <Card.Body className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Task Info */}
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        isCompleted
                          ? "bg-success/10"
                          : "bg-surface-secondary"
                      }`}>
                        {isCompleted ? (
                          <CheckmarkCircle03Icon size={24} className="text-success" variant="solid" />
                        ) : (
                          getMethodIcon(task.verificationMethod)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-text-primary title text-base">
                            {task.title}
                          </h3>
                          {getStatusBadge(task.userCompletion)}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2 mb-3">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-text-tertiary">
                          <span className="flex items-center gap-1">
                            {getMethodIcon(task.verificationMethod)}
                            {getMethodLabel(task.verificationMethod)}
                          </span>
                          <span className="flex items-center gap-1">
                            <UserMultiple02Icon size={14} />
                            {task.totalCompletions} completed
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Reward + Action */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-3 py-1.5 rounded-lg">
                        <Coins01Icon size={16} variant="solid" />
                        <span className="font-bold text-sm title">+{task.rewardAmount} TERR</span>
                      </div>
                      {canComplete && (
                        <Button
                          size="sm"
                          onClick={() => handleComplete(task.id, task.externalUrl, task)}
                          isLoading={completingId === task.id}
                          disabled={!isConnected}
                          className="cta"
                        >
                          {task.externalUrl ? "Visit & Complete" : "Complete Task"}
                        </Button>
                      )}
                      {isRejected && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleComplete(task.id, task.externalUrl, task)}
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
    </div>
  );
}
