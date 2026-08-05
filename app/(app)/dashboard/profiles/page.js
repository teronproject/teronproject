"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Skeleton from "@/components/ui/Skeleton";
import { Layout01Icon } from "hugeicons-react";

export default function TokenProfilesPage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    async function loadTokens() {
      try {
        // Need to check the actual list endpoint. In dashboard/page.js it uses /api/projects/list. Let's fix this based on the previous grep we saw: `app/api/projects/list/route.js` exists.
        const res = await fetch(`/api/projects/list?status=ALL&search=&limit=50`);
        const data = await res.json();
        
        if (res.ok) {
          const userTokens = (data.tokens || []).filter(
            (t) => t.deployer?.walletAddress?.toLowerCase() === address.toLowerCase()
          );
          setTokens(userTokens);
        }
      } catch (err) {
        addToast({ variant: "error", message: "Failed to load tokens." });
      } finally {
        setIsLoading(false);
      }
    }

    loadTokens();
  }, [address]);

  if (isLoading) {
    return (
      <div className="py-12 px-6 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <Layout01Icon className="text-accent" />
          Token Profiles
        </h1>
        <p className="text-sm text-text-secondary mt-2">
          Manage the public Link-in-Bio pages for your deployed tokens. Update logos, banners, and social links to build trust with your community.
        </p>
      </div>

      {tokens.length === 0 ? (
        <div className="bg-surface-primary border border-border-primary rounded-xl p-12 text-center">
          <div className="text-4xl opacity-30 mb-4">🎨</div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">No tokens deployed yet</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-sm mx-auto">
            You need to launch a token before you can set up its public profile.
          </p>
          <Link
            href="/dashboard/create"
            className="h-10 px-6 bg-accent text-accent-text font-semibold rounded inline-flex items-center text-sm hover:bg-accent-hover transition-colors"
          >
            Launch Token
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {tokens.map((token) => (
            <Link
              key={token.id}
              href={`/dashboard/profiles/${token.id}`}
              className="group block bg-surface-primary border border-border-primary rounded-xl overflow-hidden hover:border-accent transition-colors"
            >
              <div className="h-20 bg-surface-tertiary relative border-b border-border-primary overflow-hidden">
                 {token.profile?.bannerUrl ? (
                   <img src={token.profile.bannerUrl} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-r from-surface-tertiary to-surface-secondary opacity-50"></div>
                 )}
              </div>
              <div className="p-5 flex items-start gap-4 relative">
                <div className="w-14 h-14 rounded-full border-4 border-surface-primary bg-surface-secondary flex items-center justify-center overflow-hidden shrink-0 -mt-10 relative z-10 shadow-sm">
                  {token.profile?.logoUrl ? (
                    <img src={token.profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-sm font-bold text-accent font-mono">
                      {token.symbol?.slice(0, 3)}
                    </span>
                  )}
                </div>
                <div className="-mt-2">
                  <h3 className="font-bold text-text-primary group-hover:text-accent transition-colors">
                    {token.name} <span className="text-text-tertiary font-normal text-xs ml-1">({token.symbol})</span>
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {token.deploymentStatus === "CONFIRMED" ? (
                      <span className="text-success flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success inline-block"></span> Deployed</span>
                    ) : (
                      <span className="text-warning flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-warning inline-block"></span> Pending</span>
                    )}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
