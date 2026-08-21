"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import posthog from "posthog-js";
import {
  Coins01Icon,
  Copy01Icon,
  UserMultiple02Icon,
  GiftIcon,
  Rocket01Icon,
  Task01Icon,
  Share08Icon,
  ArrowDown01Icon,
  Wallet01Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon,
  Loading03Icon,
  InformationCircleIcon,
  CheckmarkBadge01Icon,
  Tick01Icon,
  Link01Icon,
} from "hugeicons-react";

const TERR_CONTRACT = process.env.NEXT_PUBLIC_TERR_CONTRACT_ADDRESS || "0xc5457424698643d8A643FeFE787488C9aA8FBBF0";
const TERR_DECIMALS = 18;
const TERR_SYMBOL = "TERR";
const TERR_NAME = "Teron";
const TERR_LOGO = "https://www.teron.io/token.png";
const MIN_WITHDRAWAL = 10;

export default function RewardsPage() {
  const { address, isConnected, userProfile, connector, refreshProfile } = useWallet();
  const { addToast } = useToastContext();

  const [rewardData, setRewardData] = useState(null);
  const [referralData, setReferralData] = useState(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(address));
  const [isCopied, setIsCopied] = useState(false);
  const [isContractCopied, setIsContractCopied] = useState(false);

  // Withdrawal state
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [isAddingToken, setIsAddingToken] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!address) return;

    async function fetchData() {
      setIsLoading(true);
      try {
        const [rewardsRes, referralsRes, withdrawalsRes] = await Promise.all([
          fetch("/api/rewards/balance", {
            headers: { "x-wallet-address": address },
          }),
          fetch("/api/referrals", {
            headers: { "x-wallet-address": address },
          }),
          fetch("/api/rewards/withdraw", {
            headers: { "x-wallet-address": address },
          }),
        ]);

        const rewards = await rewardsRes.json();
        const referrals = await referralsRes.json();
        const withdrawals = await withdrawalsRes.json();

        if (isMounted) {
          if (rewards.success) setRewardData(rewards);
          if (referrals.success) setReferralData(referrals);
          if (withdrawals.success) setWithdrawalHistory(withdrawals.withdrawals || []);
        }
      } catch (err) {
        console.error("Failed to load rewards:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [address]);

  const balance = rewardData?.balance ?? userProfile?.terrBalance ?? 0;
  const grants = rewardData?.grants || [];

  // Validation calculations for withdrawal amount
  const parsedWithdrawAmount = useMemo(() => {
    const num = parseFloat(withdrawAmount);
    return isNaN(num) ? 0 : num;
  }, [withdrawAmount]);

  const isAmountEmpty = !withdrawAmount || withdrawAmount.trim() === "";
  const isBelowMin = !isAmountEmpty && parsedWithdrawAmount < MIN_WITHDRAWAL;
  const isAboveBalance = !isAmountEmpty && parsedWithdrawAmount > balance;
  const isValidWithdrawAmount = !isAmountEmpty && !isBelowMin && !isAboveBalance && parsedWithdrawAmount >= MIN_WITHDRAWAL;

  const remainingBalance = useMemo(() => {
    if (isAmountEmpty || isNaN(parsedWithdrawAmount)) return balance;
    return Math.max(0, balance - parsedWithdrawAmount);
  }, [balance, isAmountEmpty, parsedWithdrawAmount]);

  // Quick percentage selection helper
  const handleQuickPercent = (pct) => {
    if (balance <= 0) return;
    if (pct === 1) {
      setWithdrawAmount(String(Math.floor(balance * 100) / 100));
    } else {
      const calculated = Math.floor(balance * pct * 100) / 100;
      setWithdrawAmount(calculated > 0 ? String(calculated) : "");
    }
  };

  async function copyReferralLink() {
    if (!referralData?.referralCode) return;
    const link = `${window.location.origin}?ref=${referralData.referralCode}`;
    await navigator.clipboard.writeText(link);
    posthog.capture("referral_link_copied");
    setIsCopied(true);
    addToast({ variant: "success", message: "Referral link copied!" });
    setTimeout(() => setIsCopied(false), 2500);
  }

  async function copyContractAddress() {
    await navigator.clipboard.writeText(TERR_CONTRACT);
    setIsContractCopied(true);
    addToast({ variant: "success", message: "TERR Contract address copied!" });
    setTimeout(() => setIsContractCopied(false), 2500);
  }

  // Withdraw TERR tokens with full validations
  const handleWithdraw = useCallback(async () => {
    if (!isConnected || !address) {
      addToast({ variant: "error", message: "Please connect your wallet first." });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      addToast({ variant: "error", message: "Please enter a valid withdrawal amount." });
      return;
    }

    if (amount < MIN_WITHDRAWAL) {
      addToast({ variant: "error", message: `Minimum withdrawal amount is ${MIN_WITHDRAWAL} TERR.` });
      return;
    }

    if (amount > balance) {
      addToast({ variant: "error", message: `Insufficient balance. You only have ${balance.toLocaleString()} TERR available.` });
      return;
    }

    setIsWithdrawing(true);
    try {
      const res = await fetch("/api/rewards/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (data.success) {
        posthog.capture("terr_withdrawal", { amount, txHash: data.txHash });
        addToast({
          variant: "success",
          message: `Successfully initiated withdrawal of ${amount.toLocaleString()} TERR!`,
        });

        // Update balance locally
        setRewardData((prev) => prev ? { ...prev, balance: Math.max(0, prev.balance - amount) } : prev);
        setWithdrawAmount("");
        setShowWithdrawForm(false);

        // Refresh user profile in background
        refreshProfile?.();

        // Reload withdrawal history
        try {
          const wRes = await fetch("/api/rewards/withdraw", {
            headers: { "x-wallet-address": address },
          });
          const wData = await wRes.json();
          if (wData.success) setWithdrawalHistory(wData.withdrawals || []);
        } catch (_) {}
      } else {
        addToast({ variant: "error", message: data.message || "Withdrawal failed. Please try again." });
      }
    } catch (err) {
      console.error("Withdrawal failed:", err);
      addToast({ variant: "error", message: "Withdrawal request failed. Please check your connection." });
    } finally {
      setIsWithdrawing(false);
    }
  }, [withdrawAmount, isConnected, address, balance, addToast, refreshProfile]);

  // Add TERR token to connected wallet (supports MetaMask, Trust Wallet, Rabby, Coinbase, etc. via EIP-747)
  const handleAddToWallet = useCallback(async () => {
    if (!isConnected) {
      addToast({ variant: "error", message: "Please connect your wallet first to add TERR token." });
      return;
    }

    setIsAddingToken(true);
    try {
      let provider = null;
      if (typeof window !== "undefined" && window.ethereum) {
        provider = window.ethereum;
      } else if (connector?.getProvider) {
        provider = await connector.getProvider();
      }

      if (!provider || typeof provider.request !== "function") {
        addToast({ variant: "error", message: "No compatible wallet provider found to auto-add token." });
        return;
      }

      const wasAdded = await provider.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: TERR_CONTRACT,
            symbol: TERR_SYMBOL,
            decimals: TERR_DECIMALS,
            image: TERR_LOGO,
          },
        },
      });

      if (wasAdded) {
        posthog.capture("terr_added_to_wallet");
        addToast({ variant: "success", message: "TERR token successfully added to your wallet!" });
      } else {
        addToast({ variant: "info", message: "Token addition was not confirmed in your wallet." });
      }
    } catch (err) {
      if (err?.code === 4001 || err?.message?.toLowerCase()?.includes("rejected") || err?.message?.toLowerCase()?.includes("user denied")) {
        addToast({ variant: "warning", message: "Token addition request was cancelled in your wallet." });
      } else {
        console.error("Add to wallet failed:", err);
        addToast({
          variant: "error",
          message: "Could not auto-add token. You can copy the contract address below to import manually.",
        });
      }
    } finally {
      setIsAddingToken(false);
    }
  }, [isConnected, connector, addToast]);

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

  function getWithdrawalStatusBadge(status) {
    switch (status) {
      case "CONFIRMED":
        return <Badge variant="success" size="sm"><CheckmarkCircle02Icon size={12} className="mr-1" />Confirmed</Badge>;
      case "PENDING":
        return <Badge variant="warning" size="sm"><Loading03Icon size={12} className="mr-1 animate-spin" />Pending</Badge>;
      case "FAILED":
        return <Badge variant="danger" size="sm"><Cancel01Icon size={12} className="mr-1" />Failed</Badge>;
      default:
        return <Badge size="sm">{status}</Badge>;
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

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl title text-text-primary">
          TERR Rewards
        </h1>
        <p className="text-sm text-balance text-text-tertiary mt-2 max-w-2xl">
          Earn TERR tokens by deploying tokens, completing tasks, and referring friends. Track your balance, withdraw on-chain to your wallet, and view reward history.
        </p>
      </div>

      {/* Balance Hero Card with Motion Layout */}
      <motion.div
        layout
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="card overflow-hidden"
      >
        <div className="card-body p-8 relative">
          <div className="absolute top-0 right-0 w-56 h-56 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
          
          <motion.div layout="position" className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs stitle text-text-tertiary uppercase tracking-widest mb-2">Your Balance</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-5xl title font-extrabold text-text-primary">
                    {balance.toLocaleString()}
                  </p>
                  <span className="text-lg title text-accent font-bold">TERR</span>
                </div>
                <p className="text-xs text-text-tertiary mt-2">
                  Earned from {grants.length} reward{grants.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Verified Token Contract Info Chip */}
              <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-center bg-surface-secondary border border-border-primary/60 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-border-primary">
                    <Image
                      src="/token.png"
                      alt="TERR Logo"
                      width={20}
                      height={20}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-text-primary">TERR Token (BEP-20)</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <CheckmarkBadge01Icon size={11} /> Verified
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
                  <span>{TERR_CONTRACT.slice(0, 6)}...{TERR_CONTRACT.slice(-4)}</span>
                  <button
                    onClick={copyContractAddress}
                    title="Copy contract address"
                    className="hover:text-text-primary transition-colors flex items-center gap-1"
                  >
                    {isContractCopied ? (
                      <Tick01Icon size={12} className="text-emerald-400" />
                    ) : (
                      <Copy01Icon size={12} />
                    )}
                  </button>
                  <span>·</span>
                  <a
                    href={`https://bscscan.com/token/${TERR_CONTRACT}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover transition-colors flex items-center gap-0.5"
                  >
                    BscScan <Link01Icon size={10} />
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <Button
                onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                className="cta max-w-40 whitespace-normal break-words"
                size="md"
              >
                {showWithdrawForm ? "Close Withdrawal" : "Withdraw TERR"}
              </Button>

              {/* Add TERR to Wallet button with next/image logo & state validations */}
              <button
                onClick={handleAddToWallet}
                disabled={isAddingToken}
                title={!isConnected ? "Connect wallet first" : "Import TERR token to your connected wallet"}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[10px] border border-border-primary text-sm font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 bg-surface-secondary/80 hover:bg-surface-secondary transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none group"
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 ring-1 ring-border-primary group-hover:scale-105 transition-transform">
                  <Image
                    src="/token.png"
                    alt="TERR Logo"
                    width={20}
                    height={20}
                    className="object-cover"
                  />
                </div>
                <span>{isAddingToken ? "Adding to Wallet..." : "Add TERR to Wallet"}</span>
              </button>
            </div>

            {/* Dynamic Withdrawal Form with Motion Layout */}
            <AnimatePresence initial={false}>
              {showWithdrawForm && (
                <motion.div
                  key="withdraw-form"
                  layout
                  initial={{ opacity: 0, height: 0, scale: 0.98 }}
                  animate={{
                    opacity: 1,
                    height: "auto",
                    scale: 1,
                    transition: {
                      height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.25, delay: 0.05 },
                      scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  exit={{
                    opacity: 0,
                    height: 0,
                    scale: 0.98,
                    transition: {
                      height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.15 },
                      scale: { duration: 0.2 },
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-6 p-6 rounded-2xl border border-border-primary bg-surface-secondary/70 backdrop-blur-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                        <ArrowDown01Icon size={16} className="text-accent" />
                        Set Withdrawal Amount
                      </h3>
                      <span className="text-xs text-text-tertiary font-mono">
                        Available: <strong className="text-text-primary">{balance.toLocaleString()} TERR</strong>
                      </span>
                    </div>

                    <p className="text-xs text-text-tertiary leading-relaxed">
                      Enter how much TERR you want to withdraw directly to your connected wallet on BNB Smart Chain. (Minimum {MIN_WITHDRAWAL} TERR).
                    </p>

                    {/* Amount input with currency label & validation styling */}
                    <div className="space-y-2">
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder={`Enter amount (min ${MIN_WITHDRAWAL})`}
                          min={MIN_WITHDRAWAL}
                          max={balance}
                          step="any"
                          className={`w-full h-12 bg-bg-primary border ${
                            isBelowMin || isAboveBalance
                              ? "border-red-500/70 focus:border-red-500"
                              : isValidWithdrawAmount
                              ? "border-emerald-500/70 focus:border-emerald-500"
                              : "border-border-primary focus:border-accent/60"
                          } rounded-xl pl-4 pr-24 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                        />
                        <div className="absolute right-3 flex items-center gap-2">
                          <span className="text-xs font-bold text-accent font-mono">TERR</span>
                        </div>
                      </div>

                      {/* Quick percentage pills */}
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[11px] text-text-tertiary">Quick select:</span>
                        {[
                          { label: "25%", val: 0.25 },
                          { label: "50%", val: 0.5 },
                          { label: "75%", val: 0.75 },
                          { label: "MAX", val: 1 },
                        ].map((pill) => (
                          <button
                            key={pill.label}
                            type="button"
                            onClick={() => handleQuickPercent(pill.val)}
                            disabled={balance <= 0}
                            className="px-2.5 py-1 text-[11px] font-semibold rounded-md border border-border-primary/80 bg-surface-tertiary/60 hover:bg-accent/10 hover:border-accent/40 hover:text-accent text-text-secondary transition-all disabled:opacity-40"
                          >
                            {pill.label}
                          </button>
                        ))}
                      </div>

                      {/* Real-time Validation Error Messages */}
                      <AnimatePresence>
                        {isBelowMin && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-xs text-amber-400 flex items-center gap-1.5 pt-1"
                          >
                            <InformationCircleIcon size={14} className="shrink-0" />
                            Amount must be at least {MIN_WITHDRAWAL} TERR to withdraw.
                          </motion.p>
                        )}
                        {isAboveBalance && (
                          <motion.p
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="text-xs text-red-400 flex items-center gap-1.5 pt-1"
                          >
                            <Cancel01Icon size={14} className="shrink-0" />
                            Amount exceeds your available balance of {balance.toLocaleString()} TERR.
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Transfer summary breakdown */}
                    <AnimatePresence>
                      {isValidWithdrawAmount && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -6, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3.5 rounded-xl bg-surface-tertiary/50 border border-border-primary/40 text-xs space-y-1.5 font-mono">
                            <div className="flex justify-between text-text-tertiary">
                              <span>Withdraw Amount:</span>
                              <span className="text-text-primary font-bold">{parsedWithdrawAmount.toLocaleString()} TERR</span>
                            </div>
                            <div className="flex justify-between text-text-tertiary">
                              <span>Receiving Wallet:</span>
                              <span className="text-accent font-medium">{address ? `${address.slice(0, 8)}...${address.slice(-6)}` : "Connected Wallet"}</span>
                            </div>
                            <div className="flex justify-between text-text-tertiary">
                              <span>Remaining Balance:</span>
                              <span className="text-text-secondary">{remainingBalance.toLocaleString()} TERR</span>
                            </div>
                            <div className="flex justify-between text-text-tertiary pt-1 border-t border-border-primary/30">
                              <span>Network Gas Fee:</span>
                              <span className="text-emerald-400 font-sans font-medium">Free (Covered by Teron)</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Confirm Button */}
                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowWithdrawForm(false);
                          setWithdrawAmount("");
                        }}
                        className="px-4 py-2.5 text-xs text-text-tertiary hover:text-text-primary transition-colors"
                      >
                        Cancel
                      </button>
                      <Button
                        onClick={handleWithdraw}
                        isLoading={isWithdrawing}
                        disabled={isWithdrawing || !isValidWithdrawAmount}
                        className="cta"
                        size="md"
                      >
                        {isWithdrawing ? "Sending On-Chain..." : `Confirm Withdraw ${parsedWithdrawAmount > 0 ? `${parsedWithdrawAmount.toLocaleString()} TERR` : ""}`}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      {/* Withdrawal History */}
      {withdrawalHistory.length > 0 && (
        <Card>
          <Card.Header>
            <h2 className="text-md title font-bold text-text-primary flex items-center gap-2">
              <ArrowDown01Icon size={18} className="text-accent" />
              Withdrawal History
            </h2>
          </Card.Header>
          <Card.Body>
            <div className="divide-y divide-border-primary/50">
              {withdrawalHistory.map((w) => (
                <div key={w.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-secondary flex items-center justify-center">
                      <ArrowDown01Icon size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">
                        -{w.amount.toLocaleString()} TERR
                      </p>
                      <p className="text-[11px] text-text-tertiary flex items-center gap-1.5">
                        {new Date(w.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {w.txHash && (
                          <>
                            <span className="text-border-primary">·</span>
                            <a
                              href={`https://bscscan.com/tx/${w.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-accent hover:text-accent-hover transition-colors font-mono inline-flex items-center gap-0.5"
                            >
                              {w.txHash.slice(0, 8)}...{w.txHash.slice(-6)}
                              <Link01Icon size={10} />
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                  {getWithdrawalStatusBadge(w.status)}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}

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
              <Copy01Icon size={16} className="mr-1.5 inline" />
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
