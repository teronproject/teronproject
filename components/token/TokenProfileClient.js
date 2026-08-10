"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { GlobalIcon, NewTwitterIcon, TelegramIcon, DiscordIcon, Search01Icon, Shield01Icon, Copy01Icon, File02Icon, Tag01Icon, Coins01Icon, Calendar01Icon, Wallet01Icon, InformationSquareIcon } from "hugeicons-react";
import CanvasBackground from "../landing/CanvasBackground";

export default function TokenProfileClient({ symbolOrAddr, initialToken, initialError }) {
  const [token, setToken] = useState(initialToken);
  const [isLoading, setIsLoading] = useState(!initialToken && !initialError);
  const [error, setError] = useState(initialError);
  const [isCopied, setIsCopied] = useState(false);

  const { chain } = useWallet();
  const { addToast } = useToastContext();

  useEffect(() => {
    async function fetchTokenData() {
      if (initialToken || initialError) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/projects/${encodeURIComponent(symbolOrAddr)}`);
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
  }, [symbolOrAddr, initialToken, initialError]);

  const handleCopyAddress = () => {
    if (!token?.contractAddress) return;
    navigator.clipboard.writeText(token.contractAddress);
    setIsCopied(true);
    addToast({ variant: "success", message: "Contract address copied to clipboard!" });
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getBscScanUrl = (targetAddress, isTx = false) => {
    const baseUrl = "https://bscscan.com";
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
      <div className="max-w-5xl mx-auto py-32 px-4 text-center space-y-8">
        <div className="w-24 h-24 rounded-full bg-surface-secondary flex items-center justify-center mx-auto shadow-sm border border-border-secondary">
          <Search01Icon size={40} className="text-text-tertiary" variant="stroke-rounded" />
        </div>
        <div>
          <h1 className="text-3xl font-bold title text-text-primary mb-2">Token Profile Not Found</h1>
          <p className="text-sm stitle text-text-secondary max-w-md mx-auto">
            We couldn't find a token matching "{symbolOrAddr}". It may not have completed deployment yet or the symbol is mistyped.
          </p>
        </div>
        <div className="pt-4 flex justify-center gap-4">
          <Link href="/leaderboard" className="h-11 px-8 card text-white font-semibold rounded-lg inline-flex items-center text-sm transition-transform hover:scale-[1.02]">
            Explore Leaderboard
          </Link>
          <Link href="/dashboard/create" className="h-11 px-8 cta font-semibold rounded-lg inline-flex items-center text-sm transition-transform hover:scale-[1.02]">
            Deploy New Token
          </Link>
        </div>
      </div>
    );
  }

  const profile = token.profile || {};
  const isConfirmed = token.deploymentStatus === "CONFIRMED";

  return (
    <div className="min-h-screen pb-20 max-w-5xl mx-auto">
      {/* Banner Area */}
      <div className="relative h-64 w-full overflow-hidden rounded-b-xl">
        {profile.bannerUrl ? (
          <>
            <img 
                src={profile.bannerUrl} 
                alt="Token Banner" 
                className="w-full h-full object-cover rounded-b-xl" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary to-transparent opacity-100 rounded-b-xl pointer-events-none"></div>
          </>
        ) : (
          <div className="w-full h-full border border-border-primary border-dashed border-t-0 relative overflow-hidden rounded-b-xl">
            <CanvasBackground />
          </div>
        )}
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header Profile Section */}
        <div className="relative -mt-16 sm:-mt-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pb-8 border-b border-border-primary">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
            {/* Logo Avatar */}
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-bg-primary bg-surface-primary shadow-2xl flex items-center justify-center overflow-hidden shrink-0 z-10 relative">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt={token.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-accent font-mono">
                  {token.symbol ? token.symbol.slice(0, 3).toUpperCase() : "T"}
                </span>
              )}
            </div>

            {/* Title & Badge */}
            <div className="space-y-1 sm:mb-2 z-10 relative">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary title drop-shadow-md">{token.name}</h1>
                <span className="text-xl card py-1 font-mono uppercase bg-accent/10 px-2  rounded">({token.symbol})</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <Badge variant={isConfirmed ? "success" : "warning"} size="sm" className="shadow-sm">
                  {isConfirmed ? "✓ On-Chain Verified" : token.deploymentStatus}
                </Badge>
                <Badge variant="neutral" size="sm" className="shadow-sm">
                  {token.chain || "BNB Chain"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap gap-3 w-full sm:w-auto z-10 relative">
            {token.contractAddress ? (
              <>
                <a
                  href={getBscScanUrl(token.contractAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 cta font-semibold rounded hover:shadow-lg hover:shadow-accent/20 transition-all inline-flex items-center gap-1.5"
                >
                  <span>BscScan</span>
                  <span className="text-xs">↗</span>
                </a>
              </>
            ) : (
              <Link href={`/deployments`} className="h-10 px-5 bg-warning text-black text-sm font-bold rounded inline-flex items-center shadow-md">
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
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <Card.Header>
                <h3 className="text-lg font-bold text-text-primary title">About {token.name}</h3>
              </Card.Header>
              <Card.Body className="prose prose-invert max-w-none text-text-secondary text-sm leading-relaxed">
                {profile.shortDescription && (
                  <p className="text-sm text-text-secondary ">
                    {profile.shortDescription}
                  </p>
                )}
                {/* {profile.description ? (
                  <p className="whitespace-pre-wrap">{profile.description}</p>
                ) : (
                  <p className="italic text-text-tertiary">No extended description provided by the deployer.</p>
                )} */}
              </Card.Body>
            </Card>

            {/* Social Links Bar */}
            <Card className="shadow-sm">
              <Card.Header>
                <h3 className="text-lg font-bold text-text-primary title">Official Community & Links</h3>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                  {profile.website ? (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-5 rounded-xl card hover:border-accent transition-all duration-300 flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-accent-text transition-colors text-accent">
                        <GlobalIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-bold text-text-primary title">Website</span>
                    </a>
                  ) : (
                    <div className="p-5 rounded-xl bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed">
                      <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center mb-3 text-text-tertiary">
                        <GlobalIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-semibold text-text-tertiary">No Website</span>
                    </div>
                  )}

                  {profile.twitter ? (
                    <a href={profile.twitter.startsWith("http") ? profile.twitter : `https://x.com/${profile.twitter.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="p-5 rounded-xl card hover:border-accent transition-all duration-300 flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-accent-text transition-colors text-accent">
                        <NewTwitterIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-bold text-text-primary title">X (Twitter)</span>
                    </a>
                  ) : (
                    <div className="p-5 rounded-xl bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed">
                      <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center mb-3 text-text-tertiary">
                        <NewTwitterIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-semibold text-text-tertiary">No X</span>
                    </div>
                  )}

                  {profile.telegram ? (
                    <a href={profile.telegram.startsWith("http") ? profile.telegram : `https://${profile.telegram}`} target="_blank" rel="noopener noreferrer" className="p-5 rounded-xl card hover:border-accent transition-all duration-300 flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-accent-text transition-colors text-accent">
                        <TelegramIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-bold text-text-primary title">Telegram</span>
                    </a>
                  ) : (
                    <div className="p-5 rounded-xl bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed">
                      <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center mb-3 text-text-tertiary">
                        <TelegramIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-semibold text-text-tertiary">No Telegram</span>
                    </div>
                  )}

                  {profile.discord ? (
                    <a href={profile.discord.startsWith("http") ? profile.discord : `https://${profile.discord}`} target="_blank" rel="noopener noreferrer" className="p-5 rounded-xl card hover:border-accent transition-all duration-300 flex flex-col items-center justify-center text-center group shadow-sm hover:shadow-md hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent group-hover:text-accent-text transition-colors text-accent">
                        <DiscordIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-bold text-text-primary title">Discord</span>
                    </a>
                  ) : (
                    <div className="p-5 rounded-xl bg-surface-primary/40 border border-dashed border-border-primary flex flex-col items-center justify-center text-center opacity-50 cursor-not-allowed">
                      <div className="w-10 h-10 rounded-full bg-surface-tertiary flex items-center justify-center mb-3 text-text-tertiary">
                        <DiscordIcon size={20} variant="stroke-rounded" />
                      </div>
                      <span className="text-[13px] font-semibold text-text-tertiary">No Discord</span>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Right Sidebar: Token Specs */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="shadow-sm border border-border-primary/50 overflow-hidden relative group">
              <Card.Header className="bg-surface-secondary/80 border-b border-border-primary backdrop-blur-sm">
                <h3 className="text-lg title text-text-primary flex items-center gap-2">
                  Smart Contract Info
                </h3>
              </Card.Header>
              <Card.Body className="divide-y divide-border-primary/30 text-sm bg-surface-primary/50 backdrop-blur-sm">
                {token.contractAddress && (
                  <div className="py-4 space-y-2">
                    <span className="text-sm text-text-secondary stitle flex items-center gap-1.5">
                      <File02Icon size={15} className="text-accent/80" /> Contract Address
                    </span>
                    <div className="flex items-center justify-between gap-2 bg-surface-secondary/50 border border-border-secondary/50 px-3 py-2.5 rounded-lg group/copy hover:border-accent/30 transition-colors">
                      <code className="text-[11px] font-mono text-text-secondary truncate">{token.contractAddress}</code>
                      <button onClick={handleCopyAddress} className="text-[10px] uppercase font-bold text-text-tertiary hover:text-accent transition-colors shrink-0 flex items-center gap-1">
                        {isCopied ? <span className="text-success">Copied</span> : <><Copy01Icon size={12} /> Copy</>}
                      </button>
                    </div>
                  </div>
                )}

                <div className="py-4 flex justify-between items-center group/item hover:bg-surface-secondary/30 -mx-5 px-5 transition-colors">
                  <span className="text-sm text-text-secondary stitle flex items-center gap-1.5">
                    <Tag01Icon size={16} className="text-accent/60 group-hover/item:text-accent transition-colors" /> Token Symbol
                  </span>
                  <span className="font-bold text-text-primary uppercase font-mono bg-surface-secondary px-2 py-0.5 rounded text-xs border border-border-primary/50 shadow-sm">{token.symbol}</span>
                </div>

                <div className="py-4 flex justify-between items-center group/item hover:bg-surface-secondary/30 -mx-5 px-5 transition-colors">
                  <span className="text-sm text-text-secondary stitle flex items-center gap-1.5">
                    <InformationSquareIcon size={16} className="text-accent/60 group-hover/item:text-accent transition-colors" /> Decimals
                  </span>
                  <span className="font-bold text-text-primary font-mono text-[13px]">{token.decimals}</span>
                </div>

                <div className="py-4 flex justify-between items-center group/item hover:bg-surface-secondary/30 -mx-5 px-5 transition-colors">
                  <span className="text-sm text-text-secondary stitle flex items-center gap-1.5">
                    <Coins01Icon size={16} className="text-accent/60 group-hover/item:text-accent transition-colors" /> Initial Supply
                  </span>
                  <span className="font-bold text-text-primary font-mono text-[13px]">{token.totalSupply}</span>
                </div>

                <div className="py-4 flex justify-between items-center group/item hover:bg-surface-secondary/30 -mx-5 px-5 transition-colors">
                  <span className="text-sm text-text-secondary stitle flex items-center gap-1.5">
                    <Calendar01Icon size={16} className="text-accent/60 group-hover/item:text-accent transition-colors" /> Deployed Date
                  </span>
                  <span className="text-text-secondary font-medium text-[12px]">
                    {new Date(token.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>

                <div className="py-4 space-y-2 group/item hover:bg-surface-secondary/30 -mx-5 px-5 transition-colors">
                  <span className="text-sm text-text-secondary stitle flex items-center gap-1.5">
                    <Wallet01Icon size={16} className="text-accent/60 group-hover/item:text-accent transition-colors" /> Deployer Wallet
                  </span>
                  <p className="font-mono text-[10px] text-text-secondary truncate bg-surface-secondary/50 p-2 rounded border border-border-primary/50">
                    {token.deployer?.walletAddress || "Anonymous Deployer"}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer Credits */}
      <footer className=" mx-auto py-16 px-6 mt-12 text-left">
        
        <div className="space-y-4 text-[10px] text-text-tertiary leading-relaxed text-justify sm:text-left text-balance">
          <p>
            <strong className="text-text-secondary">Disclaimer:</strong> Tokens deployed on the Teron platform are created by independent users and organizations. Teron provides the technical infrastructure for smart contract deployment but does not endorse, vet, or guarantee the utility, safety, or financial value of any token listed.
          </p>
          <p>
            Cryptocurrency investments carry a <span className="text-warning/80 font-semibold">high degree of risk</span>, including the possible loss of all funds. Always conduct your own thorough research (DYOR) and consult with a certified financial advisor before participating in any decentralized finance (DeFi) ecosystem. By interacting with this smart contract, you agree to the <Link href="/terms" className="text-accent hover:underline">Terms & Conditions</Link> of the platform.
          </p>
        </div>
      </footer>
    </div>
  );
}
