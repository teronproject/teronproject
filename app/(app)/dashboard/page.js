"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { 
  Coins01Icon, 
  Settings01Icon, 
  ChampionIcon, 
  PlusSignIcon, 
  CheckmarkBadge01Icon, 
  Time02Icon,
  Shield01Icon,
  Rocket02Icon,
  Copy01Icon,
  Share08Icon,
  Task01Icon,
  ArrowRight02Icon,
} from "hugeicons-react";

export default function DashboardPage() {
  const { address, isConnected, userProfile } = useWallet();
  const { addToast } = useToastContext();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [rewardData, setRewardData] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!address) return;

    async function loadDashboard() {
      try {
        // Load everything in parallel
        const [profileRes, tokensRes, rewardsRes, referralsRes] = await Promise.all([
          fetch("/api/auth/profile", {
            headers: { "x-wallet-address": address },
          }),
          fetch(`/api/projects/list?status=ALL&search=&limit=50`),
          fetch("/api/rewards/balance", {
            headers: { "x-wallet-address": address },
          }),
          fetch("/api/referrals", {
            headers: { "x-wallet-address": address },
          }),
        ]);

        const profileData = await profileRes.json();
        if (profileRes.ok) setProfile(profileData.user);

        const tokensData = await tokensRes.json();
        if (tokensRes.ok) {
          const userTokens = (tokensData.tokens || []).filter(
            (t) =>
              t.deployer?.walletAddress?.toLowerCase() ===
              address.toLowerCase()
          );
          setTokens(userTokens);
        }

        const rewards = await rewardsRes.json();
        if (rewards.success) setRewardData(rewards);

        const referrals = await referralsRes.json();
        if (referrals.success) setReferralData(referrals);
      } catch (err) {
        addToast({ variant: "error", message: "Failed to load dashboard data" });
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, [address]);

  function copyReferralLink() {
    if (!referralData?.referralCode) return;
    const link = `${window.location.origin}?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    addToast({ variant: "success", message: "Referral link copied!" });
    setTimeout(() => setIsCopied(false), 2500);
  }

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
  const terrBalance = rewardData?.balance || userProfile?.terrBalance || 0;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-border-primary">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 card rounded-full bg-surface-primary border border-border-secondary flex items-center justify-center overflow-hidden">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <Card.Body className="p-6 flex flex-col items-start text-left">
            <p className="text-3xl title font-extrabold text-text-primary mb-3">
              {tokens.length}
            </p>
            <p className="text-sm title flex items-center gap-1 stitle text-text-secondary mt-1.5">
               <div className="size-6 rounded-full bg-accent/10 text-accent flex items-center justify-center ">
              <Coins01Icon size={15} variant="stroke-rounded" />
            </div>
              Total Deployments
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6 flex flex-col items-start text-left">
            <p className="text-3xl title font-extrabold text-text-primary mb-3">
              {confirmedTokens.length}
            </p>
             <p className="text-sm title flex items-center gap-1 stitle text-text-secondary mt-1.5">
               <div className="size-6 rounded-full bg-success/10 text-success flex items-center justify-center ">
              <CheckmarkBadge01Icon size={15} variant="stroke-rounded" />
            </div>
              Confirmed On-Chain
            </p>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6 flex flex-col items-start text-left">
            <p className="text-3xl title font-extrabold text-text-primary mb-3">
              {pendingTokens.length}
            </p>
            <p className="text-sm title flex items-center gap-1 stitle text-text-secondary mt-1.5">
               <div className="size-6 rounded-full bg-warning/10 text-warning flex items-center justify-center ">
              <Time02Icon size={15} variant="stroke-rounded" />
            </div>
              Pending / In Progress
            </p>
          </Card.Body>
        </Card>

        {/* TERR Balance Card */}
        <Card className="relative overflow-hidden">
          <Card.Body className="p-6 flex flex-col items-start text-left relative">
            <div className="absolute top-0 right-0 w-20 h-20 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <p className="text-3xl title font-extrabold text-accent mb-3 relative">
              {terrBalance.toLocaleString()}
            </p>
            <p className="text-sm title flex items-center gap-1 stitle text-text-secondary mt-1.5 relative">
              <div className="size-6 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <Coins01Icon size={15} variant="solid" />
              </div>
              TERR Tokens
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Tasks + Referral Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Tasks */}
        <Card>
          <Card.Header className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Task01Icon size={16} className="text-accent" variant="stroke-rounded" />
              Tasks
            </h2>
            <Link href="/dashboard/tasks" className="text-xs text-accent hover:underline flex items-center gap-1">
              View All <ArrowRight02Icon size={12} />
            </Link>
          </Card.Header>
          <Card.Body>
            <p className="text-xs text-text-secondary mb-4">
              Complete community tasks to earn TERR rewards. Follow channels, visit links, and more.
            </p>
            <Link href="/dashboard/tasks">
              <Button size="sm" className="cta">
                Go to Task Center
              </Button>
            </Link>
          </Card.Body>
        </Card>

        {/* Referral Card */}
        <Card>
          <Card.Header className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-text-primary flex items-center gap-2">
              <Share08Icon size={16} className="text-accent" variant="stroke-rounded" />
              Refer & Earn
            </h2>
            {referralData && (
              <Badge variant="accent" size="sm">
                {referralData.totalReferrals} referral{referralData.totalReferrals !== 1 ? "s" : ""}
              </Badge>
            )}
          </Card.Header>
          <Card.Body>
            <p className="text-xs text-text-secondary mb-3">
              Earn <strong className="text-accent">25 TERR</strong> for each friend who connects with your link.
            </p>
            <div className="flex items-stretch gap-2">
              <div className="flex-1 bg-surface-secondary border border-border-secondary rounded-lg px-3 py-2 flex items-center overflow-hidden">
                <code className="text-[11px] font-mono text-text-tertiary truncate">
                  {referralData?.referralCode
                    ? `${typeof window !== "undefined" ? window.location.origin : ""}?ref=${referralData.referralCode}`
                    : "Loading..."}
                </code>
              </div>
              <button
                onClick={copyReferralLink}
                disabled={!referralData?.referralCode}
                className="px-3 py-2 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors flex items-center gap-1 text-xs font-semibold shrink-0"
              >
                <Copy01Icon size={14} />
                {isCopied ? "Copied!" : "Copy"}
              </button>
            </div>
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
            View Leaderboard 
          </Link>
        </Card.Header>
        <Card.Body>
          {tokens.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <Coins01Icon size={48} className="mx-auto text-text-tertiary opacity-30" variant="stroke-rounded" />
              <div>
                <p className="text-text-primary font-semibold text-sm">
                  You haven't deployed any tokens yet.
                </p>
                <p className="text-text-secondary text-xs mt-1.5 max-w-sm mx-auto">
                  Start your journey by creating a premium BEP-20 token on BNB Chain in just a few minutes.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold hover:underline"
                >
                  Launch your first token <span aria-hidden="true">→</span>
                </Link>
              </div>
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
      <div className="flex flex-wrap gap-4 pt-4 border-t border-dashed border-border-primary">
        <Link
          href="/dashboard/settings"
          className="h-10 px-5 bg-surface-primary border border-border-secondary text-text-primary text-xs font-semibold rounded-lg hover:bg-surface-secondary hover:border-border-primary transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <Settings01Icon size={16} variant="stroke-rounded" className="text-text-secondary" />
          Edit Profile
        </Link>
        <Link
          href="/dashboard/rewards"
          className="h-10 px-5 bg-surface-primary border border-border-secondary text-text-primary text-xs font-semibold rounded-lg hover:bg-surface-secondary hover:border-border-primary transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <Coins01Icon size={16} variant="stroke-rounded" className="text-text-secondary" />
          Reward History
        </Link>
        <Link
          href="/leaderboard"
          className="h-10 px-5 bg-surface-primary border border-border-secondary text-text-primary text-xs font-semibold rounded-lg hover:bg-surface-secondary hover:border-border-primary transition-all inline-flex items-center gap-2 shadow-sm"
        >
          <ChampionIcon size={16} variant="stroke-rounded" className="text-text-secondary" />
          View Leaderboard
        </Link>
      </div>

      {/* Helpful Information */}
      <div className="pt-10 pb-6 mt-8">
        <h3 className="text-lg font-bold title text-text-primary mb-6 title">Managing Your Tokens on BNB Chain</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm text-text-secondary leading-relaxed">
          <div>
            <h4 className="stitle text-text-primary mb-3 flex items-center gap-2">
              <Shield01Icon size={18} className="text-success" variant="stroke-rounded" /> 
              Security & Verification
            </h4>
            <p className="mb-4 text-xs text-gray-400">
              Deploying a BEP-20 token on BNB Smart Chain is just the first step. To build lasting trust with your community and potential investors, we strongly recommend verifying your smart contract on BscScan. A verified contract allows anyone to read the source code and confirm there are no malicious functions or hidden minting mechanics.
            </p>
            <p className="text-xs text-gray-400">
              Teron provides automated verification services during the deployment phase, saving you the hassle of manually flattening and uploading your Solidity files, while instantly granting your project a layer of transparency.
            </p>
          </div>
          <div>
            <h4 className="stitle text-text-primary mb-3 flex items-center gap-2">
              <Rocket02Icon size={18} className="text-accent" variant="stroke-rounded" />
              Liquidity & Ecosystem Growth
            </h4>
            <p className="mb-4 text-xs text-gray-400">
              Once your token is live, the next major milestone is typically establishing a liquidity pool on a decentralized exchange (DEX) like PancakeSwap. Providing initial liquidity allows users to buy and sell your token freely, creating a healthy market ecosystem.
            </p>
            <p className="text-xs text-gray-400">
              Keep your token profile up to date on Teron. An active profile with accurate metadata (logo, website, active social links) dramatically improves your token's visibility on the Leaderboard and makes it significantly easier for tracking platforms to index your project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
