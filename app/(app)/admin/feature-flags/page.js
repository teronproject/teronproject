"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";

const DEFAULT_FLAGS = [
  { key: "token_creation", label: "Token Creation" },
  { key: "contract_verification", label: "Contract Verification" },
  { key: "metadata_submission", label: "Metadata Submission" },
  { key: "leaderboard", label: "Leaderboard" },
  { key: "referral_system", label: "Referral System" },
  { key: "community_tasks", label: "Community Tasks" },
  { key: "bnb_assistance", label: "BNB Assistance" },
  { key: "swap_terr_to_ter", label: "TERR → TER Swap" },
  { key: "premium_addons", label: "Premium Add-ons" },
  { key: "maintenance_mode", label: "Maintenance Mode" },
];

export default function FeatureFlagsPage() {
  const { address } = useWallet();
  const [flags, setFlags] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [togglingKey, setTogglingKey] = useState(null);
  const [seedingDefaults, setSeedingDefaults] = useState(false);

  const loadFlags = async () => {
    try {
      const res = await fetch("/api/admin/feature-flags", {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) setFlags(data.flags);
    } catch (err) {
      console.error("Failed to load feature flags:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadFlags();
  }, [address]);

  const handleToggle = async (key, currentEnabled) => {
    setTogglingKey(key);
    try {
      const res = await fetch("/api/admin/feature-flags", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-wallet-address": address },
        body: JSON.stringify({ key, enabled: !currentEnabled }),
      });
      const data = await res.json();
      if (data.success) {
        setFlags(prev => prev.map(f => f.key === key ? data.flag : f));
      }
    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setTogglingKey(null);
    }
  };

  const handleSeedDefaults = async () => {
    setSeedingDefaults(true);
    try {
      for (const df of DEFAULT_FLAGS) {
        if (!flags.find(f => f.key === df.key)) {
          await fetch("/api/admin/feature-flags", {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-wallet-address": address },
            body: JSON.stringify({ key: df.key, label: df.label, enabled: df.key !== "maintenance_mode" }),
          });
        }
      }
      await loadFlags();
    } catch (err) {
      console.error("Seed error:", err);
    } finally {
      setSeedingDefaults(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl title text-text-primary">Feature Flags</h1>
          <p className="text-sm text-text-secondary mt-1">
            Toggle platform modules on or off. Changes take effect immediately.
          </p>
        </div>
        {flags.length === 0 && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleSeedDefaults}
            isLoading={seedingDefaults}
          >
            Seed Default Flags
          </Button>
        )}
      </div>

      {flags.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-primary rounded-xl">
          <p className="text-text-secondary text-sm mb-4">No feature flags found in the database.</p>
          <Button variant="primary" onClick={handleSeedDefaults} isLoading={seedingDefaults}>
            Initialize Default Flags
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {flags.map((flag) => {
            const isMaintenance = flag.key === "maintenance_mode";
            return (
              <div
                key={flag.key}
                className={`flex items-center justify-between p-5 rounded-xl border transition-colors ${
                  isMaintenance && flag.enabled
                    ? "border-error/30 bg-error/5"
                    : "border-border-primary bg-surface-primary"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-semibold text-text-primary">{flag.label || flag.key}</p>
                    {isMaintenance && flag.enabled && (
                      <Badge variant="error" size="sm">ACTIVE</Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-tertiary font-mono mt-1">{flag.key}</p>
                </div>
                <button
                  onClick={() => handleToggle(flag.key, flag.enabled)}
                  disabled={togglingKey === flag.key}
                  className="shrink-0 ml-4 cursor-pointer"
                  aria-label={`Toggle ${flag.label}`}
                >
                  <div className={`w-12 h-7 rounded-full transition-all duration-300 relative ${
                    flag.enabled
                      ? isMaintenance ? "bg-error" : "bg-accent"
                      : "bg-surface-tertiary"
                  }`}>
                    <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
                      flag.enabled ? "translate-x-5" : "translate-x-0"
                    }`} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
