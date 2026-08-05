"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  const { address, isConnected, userProfile } = useWallet();
  const { addToast } = useToastContext();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!address) return;

    async function loadDashboard() {
      try {
        // Load full profile with counts
        const profileRes = await fetch("/api/auth/profile", {
          headers: { "x-wallet-address": address },
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) setProfile(profileData.user);

        // Load user's deployed tokens
        const tokensRes = await fetch(
          `/api/projects/list?status=ALL&search=&limit=50`
        );
        const tokensData = await tokensRes.json();
        if (tokensRes.ok) {
          // Filter to this user's tokens
          const userTokens = (tokensData.tokens || []).filter(
            (t) =>
              t.deployer?.walletAddress?.toLowerCase() ===
              address.toLowerCase()
          );
          setTokens(userTokens);
        }
      } catch (err) {
        addToast({ variant: "error", message: "Failed to load dashboard data" });
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [address]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const confirmedTokens = tokens.filter(
    (t) => t.deploymentStatus === "CONFIRMED"
  );
  const pendingTokens = tokens.filter(
    (t) => t.deploymentStatus !== "CONFIRMED" && t.deploymentStatus !== "FAILED"
  );

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-border-primary">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-surface-primary border border-border-secondary flex items-center justify-center overflow-hidden">
            {profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-accent font-mono">
                {address?.slice(2, 4).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-xl title mb-1 font-bold text-text-primary">
              {profile?.displayName
                ? `Welcome, ${profile.displayName}`
                : "Your Dashboard"}
            </h1>
            <p className="text-xs font-mono text-text-tertiary">{address}</p>
          </div>
        </div>

        <Link
          href="/dashboard/create"
          className="h-11 px-6 bg-accent cta text-accent-text font-bold rounded-lg inline-flex items-center justify-center hover:bg-accent-hover transition-all shadow-md shrink-0"
        >
          + Create New Token
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body className="text-center py-6">
            <p className="text-3xl font-extrabold text-accent">
              {tokens.length}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Total Deployments
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center py-6">
            <p className="text-3xl font-extrabold text-success">
              {confirmedTokens.length}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Confirmed On-Chain
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="text-center py-6">
            <p className="text-3xl font-extrabold text-warning">
              {pendingTokens.length}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              Pending / In Progress
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Token List */}
      <Card>
        <Card.Header className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-text-primary">
            Your Deployed Tokens
          </h2>
          <Link
            href="/leaderboard"
            className="text-xs text-accent hover:underline"
          >
            View Leaderboard →
          </Link>
        </Card.Header>
        <Card.Body>
          {tokens.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <div className="text-4xl opacity-20">🪙</div>
              <p className="text-text-secondary text-sm">
                You haven't deployed any tokens yet.
              </p>
              <Link
                href="/dashboard/create"
                className="inline-block text-accent text-sm font-semibold hover:underline"
              >
                Launch your first BEP-20 token →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border-primary">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-tertiary border border-border-secondary flex items-center justify-center overflow-hidden shrink-0">
                      {token.profile?.logoUrl ? (
                        <img
                          src={token.profile.logoUrl}
                          alt={token.symbol}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-accent font-mono">
                          {token.symbol?.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary text-sm">
                          {token.name}
                        </span>
                        <span className="text-xs font-mono text-text-tertiary">
                          ${token.symbol}
                        </span>
                      </div>
                      <p className="text-xs text-text-tertiary">
                        {token.contractAddress
                          ? `${token.contractAddress.slice(0, 10)}...${token.contractAddress.slice(-6)}`
                          : "No contract address yet"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        token.deploymentStatus === "CONFIRMED"
                          ? "success"
                          : token.deploymentStatus === "FAILED"
                          ? "error"
                          : "warning"
                      }
                      size="sm"
                    >
                      {token.deploymentStatus}
                    </Badge>
                    <Link
                      href={`/t/${token.symbol?.toLowerCase()}`}
                      className="text-xs text-accent hover:underline font-medium"
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-border-primary">
        <Link
          href="/dashboard/settings"
          className="h-10 px-5 bg-surface-primary border border-border-secondary text-text-primary text-sm font-semibold rounded hover:bg-surface-secondary transition-colors inline-flex items-center gap-2"
        >
          ⚙ Edit Profile
        </Link>
        <Link
          href="/leaderboard"
          className="h-10 px-5 bg-surface-primary border border-border-secondary text-text-primary text-sm font-semibold rounded hover:bg-surface-secondary transition-colors inline-flex items-center gap-2"
        >
          📊 Leaderboard
        </Link>
      </div>
    </div>
  );
}
