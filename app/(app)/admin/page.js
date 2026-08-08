"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import Link from "next/link";
import Skeleton from "@/components/ui/Skeleton";
import { 
  UserMultiple02Icon, 
  CoinsSwapIcon, 
  CheckmarkBadge01Icon, 
  MoneyBag02Icon,
  SecurityCheckIcon,
  Loading02Icon
} from "hugeicons-react";

export default function AdminOverviewPage() {
  const { address } = useWallet();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats", {
          headers: { "x-wallet-address": address },
        });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, [address]);

  if (isLoading) {
    return (
      <div className="py-12 px-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || 0, icon: UserMultiple02Icon, color: "text-accent" },
    { label: "Tokens Deployed", value: stats?.confirmedTokens || 0, icon: CoinsSwapIcon, color: "text-success" },
    { label: "Pending Verification", value: stats?.pendingVerifications || 0, icon: SecurityCheckIcon, color: "text-warning" },
    { label: "Revenue (BNB)", value: stats?.totalRevenueBnb?.toFixed(4) || "0.0000", icon: MoneyBag02Icon, color: "text-accent" },
    { label: "Total Tokens", value: stats?.totalTokens || 0, icon: CoinsSwapIcon, color: "text-text-primary" },
    { label: "Total Payments", value: stats?.totalPayments || 0, icon: MoneyBag02Icon, color: "text-text-primary" },
    { label: "Confirmed Payments", value: stats?.confirmedPayments || 0, icon: CheckmarkBadge01Icon, color: "text-success" },
    { label: "Pending Metadata", value: stats?.pendingMetadata || 0, icon: Loading02Icon, color: "text-warning" },
  ];

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl title text-text-primary">Platform Overview</h1>
        <p className="text-sm text-text-secondary mt-1">
          Real-time stats and metrics for the Teron platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface-primary card border border-border-primary rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary stitle">{stat.label}</span>
                <Icon size={18} className={stat.color} variant="stroke-rounded" />
              </div>
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-surface-primary border card border-border-primary rounded-xl p-6">
        <h2 className="title text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/tokens"
            className="flex items-center card gap-3 p-4 bg-surface-secondary border border-border-secondary rounded-lg hover:border-accent transition-colors group"
          >
            <CoinsSwapIcon size={20} className="text-text-tertiary group-hover:text-accent" />
            <div>
              <span className="text-sm font-semibold text-text-primary">Manage Tokens</span>
              <p className="text-xs text-text-tertiary">Approve verifications & metadata</p>
            </div>
          </Link>

          <Link
            href="/admin/users"
            className="flex items-center card gap-3 p-4 bg-surface-secondary border border-border-secondary rounded-lg hover:border-accent transition-colors group"
          >
            <UserMultiple02Icon size={20} className="text-text-tertiary group-hover:text-accent" />
            <div>
              <span className="text-sm font-semibold text-text-primary">Manage Users</span>
              <p className="text-xs text-text-tertiary">View all registered wallets</p>
            </div>
          </Link>

          <Link
            href="/admin/pricing"
            className="flex items-center card gap-3 p-4 bg-surface-secondary border border-border-secondary rounded-lg hover:border-accent transition-colors group"
          >
            <MoneyBag02Icon size={20} className="text-text-tertiary group-hover:text-accent" />
            <div>
              <span className="text-sm font-semibold text-text-primary">Edit Pricing</span>
              <p className="text-xs text-text-tertiary">Update verification & metadata fees</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
