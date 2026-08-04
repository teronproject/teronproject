"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";

export default function TokenProfilePage({ params }) {
  const resolvedParams = use(params);
  const symbolOrAddr = resolvedParams.symbol;

  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  const { chain } = useWallet();
  const { addToast } = useToastContext();

  useEffect(() => {
    async function fetchTokenData() {
      try {
        const res = await fetch(`/api/tokens/${encodeURIComponent(symbolOrAddr)}`);
        const data = await res.json();

        if (res.ok && data.token) {
          setToken(data.token);
        } else {
          setError(data.message || "Token not found");
        }
      } catch (err) {
        setError("Failed to fetch token profile.");
      } finally {
        setIsLoading(false);
      }
    }

    if (symbolOrAddr) fetchTokenData();
  }, [symbolOrAddr]);

  const handleCopyAddress = () => {
    if (!token?.contractAddress) return;
    navigator.clipboard.writeText(token.contractAddress);
    setIsCopied(true);
    addToast({ variant: "success", message: "Contract address copied to clipboard!" });
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getBscScanUrl = (targetAddress, isTx = false) => {
    // If testing on testnet or explicitly deployed on testnet
    const isTestnet = token?.chain?.toLowerCase().includes("testnet") || chain?.id === 97;
    const baseUrl = isTestnet ? "https://testnet.bscscan.com" : "https://bscscan.com";
    return `${baseUrl}/${isTx ? "tx" : "address"}/${targetAddress}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="flex gap-6 items-center">
          <Skeleton className="h-24 w-24 rounded-full -mt-16" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="text-5xl opacity-30">🔍</div>
        <h1 className="text-2xl font-bold text-text-primary">Token Profile Not Found</h1>
        <p className="text-text-secondary text-sm max-w-md mx-auto">
          We couldn't find a token matching "{symbolOrAddr}". It may not have completed deployment yet or the symbol is mistyped.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link href="/leaderboard" className="h-10 px-6 bg-surface-secondary border border-border-primary text-text-primary font-semibold rounded inline-flex items-center text-sm hover:bg-surface-tertiary transition-colors">
            Explore Leaderboard
          </Link>
          <Link href="/create" className="h-10 px-6 bg-accent text-accent-text font-semibold rounded inline-flex items-center text-sm hover:bg-accent-hover transition-colors">
            Deploy New Token
          </Link>
        </div>
      </div>
    );
  }

  const profile = token.profile || {};
  const isConfirmed = token.deploymentStatus === "CONFIRMED";

  return (
    <div className="min-h-screen pb-20">
      {/* Banner Area */}
      <div className="relative h-64 w-full bg-gradient-to-r from-bg-secondary via-surface-tertiary to-bg-secondary border-b border-border-primary overflow-hidden">
        {profile.bannerUrl ? (
          <img src={profile.bannerUrl} alt="Token Banner" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20 text-4xl">
            ⛓️ BNB SMART CHAIN
          </div>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Profile Section */}
        <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-8 border-b border-border-primary">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Logo Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-surface-secondary bg-surface-primary shadow-xl flex items-center justify-center overflow-hidden shrink-0">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt={token.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-accent font-mono">
                  {token.symbol ? token.symbol.slice(0, 3).toUpperCase() : "T"}
                </span>
              )}
            </div>

            {/* Title & Badge */}
            <div className="space-y-1 sm:mb-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">{token.name}</h1>
                <span className="text-lg sm:text-xl text-text-tertiary font-mono uppercase">({token.symbol})</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Badge variant={isConfirmed ? "success" : "warning"} size="sm">
                  {isConfirmed ? "✓ On-Chain Verified" : token.deploymentStatus}
                </Badge>
                <Badge variant="neutral" size="sm">
                  {token.chain || "BNB Chain"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {token.contractAddress ? (
              <>
                <Button variant="secondary" size="md" onClick={handleCopyAddress} className="flex items-center gap-2">
                  <span>{isCopied ? "✓ Copied!" : "Copy Address"}</span>
                </Button>
                <a
                  href={getBscScanUrl(token.contractAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 bg-surface-primary border border-border-secondary text-text-primary text-sm font-semibold rounded hover:bg-surface-secondary transition-colors inline-flex items-center gap-1.5"
                >
                  <span>BscScan</span>
                  <span className="text-xs text-accent">↗</span>
                </a>
              </>
            ) : (
              <Link href={`/deployments`} className="h-10 px-5 bg-warning text-black text-sm font-bold rounded inline-flex items-center">
                Check Deployment Status
              </Link>
            )}
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Description Card */}
            <Card>
              <Card.Header>
                <h3 className="text-base font-bold text-text-primary">About {token.name}</h3>
              </Card.Header>
              <Card.Body className="prose prose-invert max-w-none text-text-secondary text-sm leading-relaxed">
                {profile.shortDescription && (
                  <p className="text-base font-medium text-text-primary mb-4 border-l-4 border-accent pl-3 py-0.5 bg-surface-primary">
                    {profile.shortDescription}
                  </p>
                )}
                {profile.description ? (
                  <p className="whitespace-pre-wrap">{profile.description}</p>
                ) : (
                  <p className="italic text-text-tertiary">No extended description provided by the deployer.</p>
                )}
              </Card.Body>
            </Card>

            {/* Social Links Bar */}
            <Card>
              <Card.Header>
                <h3 className="text-base font-bold text-text-primary">Official Community & Links</h3>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-surface-primary border border-border-secondary hover:border-accent transition-colors flex flex-col items-center justify-center text-center group">
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🌐</span>
                      <span className="text-xs font-semibold text-text-primary">Website</span>
                    </a>
                  ) : (
                    <div className="p-4 rounded-lg bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-40 cursor-not-allowed">
                      <span className="text-2xl mb-2">🌐</span>
                      <span className="text-xs text-text-tertiary">No Website</span>
                    </div>
                  )}

                  {profile.twitter ? (
                    <a href={profile.twitter.startsWith("http") ? profile.twitter : `https://x.com/${profile.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-surface-primary border border-border-secondary hover:border-accent transition-colors flex flex-col items-center justify-center text-center group">
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">🐦</span>
                      <span className="text-xs font-semibold text-text-primary">Twitter / X</span>
                    </a>
                  ) : (
                    <div className="p-4 rounded-lg bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-40 cursor-not-allowed">
                      <span className="text-2xl mb-2">🐦</span>
                      <span className="text-xs text-text-tertiary">No Twitter</span>
                    </div>
                  )}

                  {profile.telegram ? (
                    <a href={profile.telegram.startsWith("http") ? profile.telegram : `https://${profile.telegram}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-surface-primary border border-border-secondary hover:border-accent transition-colors flex flex-col items-center justify-center text-center group">
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">✈️</span>
                      <span className="text-xs font-semibold text-text-primary">Telegram</span>
                    </a>
                  ) : (
                    <div className="p-4 rounded-lg bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-40 cursor-not-allowed">
                      <span className="text-2xl mb-2">✈️</span>
                      <span className="text-xs text-text-tertiary">No Telegram</span>
                    </div>
                  )}

                  {profile.discord ? (
                    <a href={profile.discord.startsWith("http") ? profile.discord : `https://${profile.discord}`} target="_blank" rel="noopener noreferrer" className="p-4 rounded-lg bg-surface-primary border border-border-secondary hover:border-accent transition-colors flex flex-col items-center justify-center text-center group">
                      <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">💬</span>
                      <span className="text-xs font-semibold text-text-primary">Discord</span>
                    </a>
                  ) : (
                    <div className="p-4 rounded-lg bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-40 cursor-not-allowed">
                      <span className="text-2xl mb-2">💬</span>
                      <span className="text-xs text-text-tertiary">No Discord</span>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Right Sidebar: Token Specs */}
          <div className="lg:col-span-4 space-y-6">
            <Card>
              <Card.Header className="bg-surface-primary">
                <h3 className="text-sm font-bold text-text-primary">Smart Contract Specs</h3>
              </Card.Header>
              <Card.Body className="divide-y divide-border-primary text-sm">
                {token.contractAddress && (
                  <div className="py-3 space-y-1">
                    <span className="text-xs text-text-tertiary uppercase font-semibold">Contract Address</span>
                    <div className="flex items-center justify-between gap-2 bg-surface-tertiary p-2 rounded">
                      <code className="text-xs font-mono text-accent truncate">{token.contractAddress}</code>
                      <button onClick={handleCopyAddress} className="text-xs text-text-secondary hover:text-white font-medium shrink-0">
                        {isCopied ? "✓" : "Copy"}
                      </button>
                    </div>
                  </div>
                )}

                <div className="py-3 flex justify-between items-center">
                  <span className="text-text-secondary">Token Symbol</span>
                  <span className="font-bold text-text-primary uppercase font-mono">{token.symbol}</span>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <span className="text-text-secondary">Decimals</span>
                  <span className="font-bold text-text-primary font-mono">{token.decimals}</span>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <span className="text-text-secondary">Initial Supply</span>
                  <span className="font-bold text-text-primary font-mono">{token.totalSupply}</span>
                </div>

                <div className="py-3 flex justify-between items-center">
                  <span className="text-text-secondary">Deployed Date</span>
                  <span className="text-text-primary font-medium">
                    {new Date(token.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="py-3 space-y-1">
                  <span className="text-xs text-text-tertiary uppercase font-semibold">Deployer Wallet</span>
                  <p className="font-mono text-xs text-text-secondary truncate">
                    {token.deployer?.walletAddress || "Anonymous Deployer"}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
