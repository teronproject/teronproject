"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

const STATUS_VARIANTS = {
  PENDING: "warning",
  REVIEWING: "accent",
  APPROVED: "success",
  REJECTED: "error",
  COMPLETED: "success",
};

function truncateAddr(addr) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AssistancePage() {
  const { address } = useWallet();
  const { addToast } = useToast();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [notesMap, setNotesMap] = useState({});

  const loadRequests = async () => {
    try {
      const params = new URLSearchParams();
      if (filter) params.set("status", filter);

      const res = await fetch(`/api/admin/assistance?${params.toString()}`, {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) {
        setRequests(data.requests);
        setStats(data.byStatus || {});
      }
    } catch (err) {
      console.error("Failed to load assistance requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadRequests();
  }, [address, filter]);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/assistance", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-wallet-address": address },
        body: JSON.stringify({ id, status, adminNotes: notesMap[id] || undefined }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ variant: "success", message: `Request updated to ${status}` });
        await loadRequests();
      }
    } catch (err) {
      addToast({ variant: "error", message: "Failed to update request." });
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl title text-text-primary">BNB Assistance Requests</h1>
        <p className="text-sm text-text-secondary mt-1">
          Review and manage user requests for BNB gas assistance.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {["PENDING", "REVIEWING", "APPROVED", "REJECTED", "COMPLETED"].map((status) => (
          <div key={status} className="bg-surface-primary card border border-border-primary rounded-xl p-4">
            <p className="text-xs text-text-secondary">{status}</p>
            <p className={`text-2xl font-extrabold mt-1 ${
              status === "PENDING" ? "text-warning" :
              status === "APPROVED" || status === "COMPLETED" ? "text-success" :
              status === "REJECTED" ? "text-error" : "text-accent"
            }`}>{stats[status] || 0}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="text-sm bg-surface-primary border border-border-primary rounded-lg px-3 py-2 text-text-primary"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="REVIEWING">Reviewing</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-primary rounded-xl">
          <p className="text-text-secondary text-sm">No assistance requests match your filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-surface-primary card border border-border-primary rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant={STATUS_VARIANTS[req.status]} size="sm">{req.status}</Badge>
                    <span className="text-[11px] text-text-tertiary">
                      {new Date(req.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-text-primary mb-1">
                    {req.user?.displayName || truncateAddr(req.user?.walletAddress)}
                  </p>
                  <p className="text-xs text-text-tertiary font-mono mb-2">
                    Wallet: {req.walletAddress}
                  </p>
                  {req.contactEmail && (
                    <p className="text-xs text-text-secondary mb-2">
                      Email: <span className="text-text-primary">{req.contactEmail}</span>
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-surface-secondary border border-border-primary rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-1">Description</p>
                <p className="text-sm text-text-secondary leading-relaxed">{req.description}</p>
              </div>

              {/* Admin Notes */}
              <div className="mb-4">
                <label className="text-xs font-semibold text-text-tertiary block mb-1.5">Admin Notes</label>
                <textarea
                  value={notesMap[req.id] !== undefined ? notesMap[req.id] : (req.adminNotes || "")}
                  onChange={(e) => setNotesMap(prev => ({ ...prev, [req.id]: e.target.value }))}
                  rows={2}
                  className="w-full bg-surface-secondary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
                  placeholder="Add internal notes..."
                />
              </div>

              {/* Action Buttons */}
              {req.status !== "COMPLETED" && req.status !== "REJECTED" && (
                <div className="flex flex-wrap gap-2">
                  {req.status === "PENDING" && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleUpdateStatus(req.id, "REVIEWING")}
                      isLoading={updatingId === req.id}
                    >
                      Start Review
                    </Button>
                  )}
                  {(req.status === "PENDING" || req.status === "REVIEWING") && (
                    <>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                        isLoading={updatingId === req.id}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                        isLoading={updatingId === req.id}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {req.status === "APPROVED" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleUpdateStatus(req.id, "COMPLETED")}
                      isLoading={updatingId === req.id}
                    >
                      Mark Completed
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
