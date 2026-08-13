"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

const SEVERITY_COLORS = {
  CRITICAL: "error",
  HIGH: "error",
  MEDIUM: "warning",
  LOW: "accent",
};

const TYPE_LABELS = {
  ERROR: "Error",
  DEPLOYMENT_FAILURE: "Deploy Failure",
  WALLET_ERROR: "Wallet Error",
  VALIDATION_FAILURE: "Validation",
  PAYMENT_ISSUE: "Payment",
  API_EXCEPTION: "API Error",
  SECURITY_EVENT: "Security",
};

export default function MonitoringPage() {
  const { address } = useWallet();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({ severity: "", type: "", resolved: "false" });
  const [resolvingId, setResolvingId] = useState(null);

  const loadEvents = async () => {
    try {
      const params = new URLSearchParams();
      if (filter.severity) params.set("severity", filter.severity);
      if (filter.type) params.set("type", filter.type);
      if (filter.resolved !== "") params.set("resolved", filter.resolved);

      const res = await fetch(`/api/admin/monitoring?${params.toString()}`, {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) {
        setEvents(data.events);
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load monitoring:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadEvents();
  }, [address, filter]);

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      const res = await fetch("/api/admin/monitoring", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-wallet-address": address },
        body: JSON.stringify({ id, resolved: true }),
      });
      if (res.ok) {
        setEvents(prev => prev.filter(e => e.id !== id));
        if (stats) setStats({ ...stats, unresolved: Math.max(0, stats.unresolved - 1) });
      }
    } catch (err) {
      console.error("Resolve error:", err);
    } finally {
      setResolvingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl title text-text-primary">Monitoring</h1>
        <p className="text-sm text-text-secondary mt-1">
          Platform health, error logs, and event tracking.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
            <p className="text-sm text-text-secondary">Total Events</p>
            <p className="text-2xl font-extrabold text-text-primary mt-1">{stats.total}</p>
          </div>
          <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
            <p className="text-sm text-text-secondary">Unresolved</p>
            <p className={`text-2xl font-extrabold mt-1 ${stats.unresolved > 0 ? "text-error" : "text-success"}`}>{stats.unresolved}</p>
          </div>
          <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
            <p className="text-sm text-text-secondary">Critical</p>
            <p className={`text-2xl font-extrabold mt-1 ${(stats.bySeverity.CRITICAL || 0) > 0 ? "text-error" : "text-text-primary"}`}>{stats.bySeverity.CRITICAL || 0}</p>
          </div>
          <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
            <p className="text-sm text-text-secondary">High</p>
            <p className={`text-2xl font-extrabold mt-1 ${(stats.bySeverity.HIGH || 0) > 0 ? "text-warning" : "text-text-primary"}`}>{stats.bySeverity.HIGH || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={filter.resolved}
          onChange={(e) => setFilter(f => ({ ...f, resolved: e.target.value }))}
          className="text-sm bg-surface-primary border border-border-primary rounded-lg px-3 py-2 text-text-primary"
        >
          <option value="false">Unresolved</option>
          <option value="true">Resolved</option>
          <option value="">All</option>
        </select>
        <select
          value={filter.severity}
          onChange={(e) => setFilter(f => ({ ...f, severity: e.target.value }))}
          className="text-sm bg-surface-primary border border-border-primary rounded-lg px-3 py-2 text-text-primary"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={filter.type}
          onChange={(e) => setFilter(f => ({ ...f, type: e.target.value }))}
          className="text-sm bg-surface-primary border border-border-primary rounded-lg px-3 py-2 text-text-primary"
        >
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-primary rounded-xl">
          <p className="text-text-secondary text-sm">No events match your filters.</p>
          <p className="text-text-tertiary text-xs mt-2">Events are logged automatically when errors occur on the platform.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className={`p-5 rounded-xl border ${
                event.severity === "CRITICAL" ? "border-error/30 bg-error/5" :
                event.severity === "HIGH" ? "border-warning/30 bg-warning/5" :
                "border-border-primary bg-surface-primary"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant={SEVERITY_COLORS[event.severity] || "accent"} size="sm">{event.severity}</Badge>
                    <Badge variant="accent" size="sm">{TYPE_LABELS[event.type] || event.type}</Badge>
                    {event.resolved && <Badge variant="success" size="sm">Resolved</Badge>}
                  </div>
                  <p className="text-sm text-text-primary font-medium leading-relaxed">{event.message}</p>
                  {event.affectedUser && (
                    <p className="text-xs text-text-tertiary mt-1 font-mono">
                      User: {event.affectedUser.displayName || event.affectedUser.walletAddress}
                    </p>
                  )}
                  {event.stackTrace && (
                    <details className="mt-2">
                      <summary className="text-xs text-text-tertiary cursor-pointer hover:text-text-secondary">Stack trace</summary>
                      <pre className="mt-1 p-3 bg-surface-secondary rounded text-xs text-text-secondary overflow-x-auto max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
                        {event.stackTrace}
                      </pre>
                    </details>
                  )}
                  <p className="text-[11px] text-text-tertiary mt-2">
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
                {!event.resolved && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleResolve(event.id)}
                    isLoading={resolvingId === event.id}
                    className="shrink-0"
                  >
                    Resolve
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
