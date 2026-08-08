"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import {
  Coins01Icon,
  Copy01Icon,
  UserMultiple02Icon,
  GiftIcon,
  Rocket01Icon,
  Task01Icon,
  Share08Icon,
} from "hugeicons-react";

export default function RewardsPage() {
  const { address, isConnected, userProfile } = useWallet();
  const { addToast } = useToastContext();

  const [rewardData, setRewardData] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!address) return;
    loadData();
  }, [address]);

  async function loadData() {
    try {
      const [rewardsRes, referralsRes] = await Promise.all([
        fetch("/api/rewards/balance", {
          headers: { "x-wallet-address": address },
        }),
        fetch("/api/referrals", {
          headers: { "x-wallet-address": address },
        }),
      ]);

      const rewards = await rewardsRes.json();
      const referrals = await referralsRes.json();

      if (rewards.success) setRewardData(rewards);
      if (referrals.success) setReferralData(referrals);
    } catch (err) {
      console.error("Failed to load rewards:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function copyReferralLink() {
    if (!referralData?.referralCode) return;
    const link = `${window.location.origin}?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    addToast({ variant: "success", message: "Referral link copied!" });
    setTimeout(() => setIsCopied(false), 2500);
  }

  function getReasonIcon(reason) {
    switch (reason) {
      case "DEPLOYMENT":
        return <Rocket01Icon size={16} className="text-accent" variant="solid" />;
      case "TASK":
        return <Task01Icon size={16} className="text-info" variant="solid" />;
      case "REFERRAL":
        return <UserMultiple02Icon size={16} className="text-success" variant="solid" />;
      case "BONUS":
        return <GiftIcon size={16} className="text-warning" variant="solid" />;
      default:
        return <Coins01Icon size={16} className="text-text-tertiary" variant="solid" />;
    }
  }

  function getReasonLabel(reason) {
    switch (reason) {
      case "DEPLOYMENT": return "Token Deployment";
      case "TASK": return "Task Completion";
      case "REFERRAL": return "Referral Reward";
      case "BONUS": return "Bonus";
      default: return reason;
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  const balance = rewardData?.balance || userProfile?.terrBalance || 0;
  const grants = rewardData?.grants || [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl title text-text-primary">
          TERR Rewards
        </h1>
        <p className="text-sm stitle text-text-tertiary mt-2 max-w-2xl">
          Earn TERR tokens by deploying tokens, completing tasks, and referring friends. Track your balance and reward history here.
        </p>
      </div>

      {/* Balance Hero Card */}
      <Card className="overflow-hidden">
        <Card.Body className="p-8 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="relative">
            <p className="text-xs stitle text-text-tertiary uppercase tracking-widest mb-2">Your Balance</p>
            <div className="flex items-baseline gap-3">
              <p className="text-5xl title font-extrabold text-text-primary">
                {balance.toLocaleString()}
              </p>
              <span className="text-lg title text-accent font-bold">TERR</span>
            </div>
            <p className="text-xs text-text-tertiary mt-3">
              Earned from {grants.length} reward{grants.length !== 1 ? "s" : ""}
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Referral Section */}
      <Card>
        <Card.Header className="flex items-center justify-between">
          <h2 className="text-md title font-bold text-text-primary flex items-center gap-2">
            <Share08Icon size={18} className="text-accent" variant="stroke-rounded" />
            Refer Friends & Earn
          </h2>
          {referralData && (
            <Badge variant="accent" size="sm">
              {referralData.totalReferrals} referral{referralData.totalReferrals !== 1 ? "s" : ""}
            </Badge>
          )}
        </Card.Header>
        <Card.Body className="space-y-5">
          <p className="text-xs text-text-secondary leading-relaxed">
            Share your unique referral link. When someone connects their wallet using your link, you earn <strong className="text-accent">25 TERR</strong> and they earn <strong className="text-accent">10 TERR</strong>.
          </p>

          {/* Referral Link */}
          <div className="flex items-stretch gap-3">
            <div className="flex-1 bg-surface-secondary border border-border-secondary rounded-xl px-4 py-3 flex items-center overflow-hidden">
              <code className="text-xs font-mono text-text-secondary truncate">
                {referralData?.referralCode
                  ? `${typeof window !== "undefined" ? window.location.origin : "https://teron.io"}?ref=${referralData.referralCode}`
                  : "Connect wallet to get your link"}
              </code>
            </div>
            <Button
              onClick={copyReferralLink}
              disabled={!referralData?.referralCode}
              className="cta shrink-0"
              size="md"
            >
              <Copy01Icon size={16} className="mr-1.5" />
              {isCopied ? "Copied!" : "Copy"}
            </Button>
          </div>

          {/* Referral Stats */}
          {referralData && referralData.totalReferrals > 0 && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-surface-secondary rounded-xl p-4 text-center">
                <p className="text-xl title font-bold text-text-primary">{referralData.totalReferrals}</p>
                <p className="text-xs text-text-tertiary mt-1">Friends Referred</p>
              </div>
              <div className="bg-surface-secondary rounded-xl p-4 text-center">
                <p className="text-xl title font-bold text-accent">{referralData.totalEarnings} TERR</p>
                <p className="text-xs text-text-tertiary mt-1">Referral Earnings</p>
              </div>
            </div>
          )}

          {/* Referred Users */}
          {referralData?.referredUsers?.length > 0 && (
            <div className="pt-3 border-t border-border-primary/50">
              <h3 className="text-xs stitle text-text-tertiary uppercase tracking-wider mb-3">Recent Referrals</h3>
              <div className="space-y-2">
                {referralData.referredUsers.slice(0, 5).map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-surface-tertiary flex items-center justify-center">
                        <span className="text-[10px] font-bold text-accent font-mono">
                          {user.walletAddress?.slice(2, 4).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-text-secondary">
                        {user.displayName || `${user.walletAddress?.slice(0, 8)}...${user.walletAddress?.slice(-4)}`}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-tertiary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Reward History */}
      <Card>
        <Card.Header>
          <h2 className="text-md title font-bold text-text-primary flex items-center gap-2">
            <Coins01Icon size={18} className="text-accent" variant="stroke-rounded" />
            Reward History
          </h2>
        </Card.Header>
        <Card.Body>
          {grants.length === 0 ? (
            <div className="py-12 text-center">
              <Coins01Icon size={40} className="mx-auto text-text-tertiary opacity-30 mb-3" variant="stroke-rounded" />
              <p className="text-sm text-text-primary font-semibold">No rewards yet</p>
              <p className="text-xs text-text-secondary mt-1.5">
                Deploy a token, complete tasks, or refer friends to earn TERR.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border-primary/50">
              {grants.map((grant) => (
                <div key={grant.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center">
                      {getReasonIcon(grant.reason)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        {getReasonLabel(grant.reason)}
                      </p>
                      <p className="text-[11px] text-text-tertiary">
                        {grant.relatedToken ? `${grant.relatedToken.name} (${grant.relatedToken.symbol})` : ""}
                        {new Date(grant.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm title font-bold text-accent">
                    +{grant.amount} TERR
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
