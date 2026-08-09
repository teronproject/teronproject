"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { 
  Layers01Icon, 
  Coins01Icon,
  PlusSignIcon
} from "hugeicons-react";

export default function DeploymentsPage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    async function fetchDeployments() {
      try {
        const res = await fetch(`/api/projects/list?status=ALL&search=&limit=100`);
        const data = await res.json();
        
        if (res.ok) {
          const userTokens = (data.tokens || []).filter(
            (t) => t.deployer?.walletAddress?.toLowerCase() === address.toLowerCase()
          );
          setTokens(userTokens);
        } else {
          addToast({ variant: "error", message: "Failed to load deployments" });
        }
      } catch (err) {
        addToast({ variant: "error", message: "Error connecting to server" });
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeployments();
  }, [address]);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary title flex items-center gap-2">
            <div className="size-8 rounded-full bg-accent/10 flex items-center justify-center">
              <Layers01Icon size={18} className="text-accent" />
            </div>
            Your Deployments
          </h1>
          <p className="text-text-secondary text-sm mt-2">
            Manage your deployed tokens and view their blockchain status.
          </p>
        </div>
        <Link 
          href="/dashboard/create"
          className="h-10 px-5 bg-accent text-accent-text text-sm font-semibold rounded-lg hover:bg-accent-hover transition-colors inline-flex items-center gap-2 cta shadow-sm"
        >
          <PlusSignIcon size={18} />
          Launch New Token
        </Link>
      </div>

      <Card>
        <Card.Body>
          {tokens.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="size-20 mx-auto bg-surface-secondary border border-border-secondary rounded-full flex items-center justify-center mb-4">
                <Coins01Icon size={36} className="text-text-tertiary opacity-50" variant="stroke-rounded" />
              </div>
              <div>
                <p className="text-text-primary font-bold text-base">
                  You haven't deployed any tokens yet.
                </p>
                <p className="text-text-secondary text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                  Start your journey by creating a premium BEP-20 token on BNB Chain in just a few minutes.
                </p>
              </div>
              <div className="pt-4">
                <Link
                  href="/dashboard/create"
                  className="inline-flex items-center gap-1.5 text-accent text-sm font-bold hover:underline"
                >
                  Launch your first token <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-border-primary -mx-6 px-6">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 group hover:bg-surface-secondary/30 transition-colors -mx-6 px-6"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-surface-tertiary border border-border-secondary flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                      {token.profile?.logoUrl ? (
                        <img
                          src={token.profile.logoUrl}
                          alt={token.symbol}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-accent font-mono">
                          {token.symbol?.slice(0, 3)}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-text-primary text-base">
                          {token.name}
                        </span>
                        <Badge variant="accent" size="sm" className="font-mono uppercase tracking-wider text-[10px]">
                          ${token.symbol}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-text-tertiary">
                        <span>Supply: {parseInt(token.totalSupply).toLocaleString()}</span>
                        <span>•</span>
                        <span className="font-mono">
                          {token.contractAddress
                            ? `${token.contractAddress.slice(0, 10)}...${token.contractAddress.slice(-8)}`
                            : "Contract not broadcasted"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
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
                    
                    {token.deploymentStatus !== "PENDING" ? (
                      <Link
                        href={`/dashboard/deployments/${token.deployments?.[0]?.id || token.id}`}
                        className="px-4 py-2 bg-surface-primary border border-border-primary rounded text-xs font-semibold text-text-primary hover:bg-surface-secondary transition-colors"
                      >
                        Deployment Status
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/deployments/${token.id}`}
                        className="px-4 py-2 bg-surface-primary border border-border-primary rounded text-xs font-semibold text-text-primary hover:bg-surface-secondary transition-colors"
                      >
                        Deploy Now
                      </Link>
                    )}
                    
                    <Link
                      href={`/t/${token.symbol?.toLowerCase()}`}
                      className="px-4 py-2 bg-surface-primary border border-border-primary rounded text-xs font-semibold text-accent hover:border-accent/50 transition-colors"
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
    </div>
  );
}
