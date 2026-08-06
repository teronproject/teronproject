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
        <h1 className="text-3xl title text-text-primary flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
            <Layout01Icon className="text-accent" variant="stroke-rounded" size={28} />
          </div>
          Token Profiles
        </h1>
        <p className="text-sm stitle text-text-secondary mt-3 max-w-2xl">
          Manage the public Link-in-Bio pages for your deployed tokens. Update logos, banners, and social links to build trust with your community.
        </p>
      </div>

      {tokens.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="text-5xl opacity-30 mb-6">🎨</div>
          <h3 className="text-xl title text-text-primary mb-2">No tokens deployed yet</h3>
          <p className="text-sm text-text-secondary mb-8 max-w-sm mx-auto">
            You need to launch a token before you can set up its public profile.
          </p>
          <Link
            href="/dashboard/create"
            className="h-11 px-8 cta font-semibold rounded-lg inline-flex items-center text-sm transition-all"
          >
            Launch Token
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {tokens.map((token) => (
            <Link
              key={token.id}
              href={`/dashboard/profiles/${token.id}`}
              className="group block card overflow-hidden hover:scale-[1.015] transition-transform duration-300 shadow-md hover:shadow-xl"
            >
              <div className="h-24 bg-surface-tertiary relative overflow-hidden">
                 {token.profile?.bannerUrl ? (
                   <img src={token.profile.bannerUrl} alt="Banner" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-tr from-surface-tertiary to-surface-secondary opacity-50 group-hover:opacity-70 transition-opacity"></div>
                 )}
                 {/* Dark gradient overlay so the banner doesn't look cut off flat */}
                 <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
              </div>
              <div className="p-6 flex items-start gap-5 relative">
                <div className="w-16 h-16 rounded-full border-[3px] border-surface-primary bg-surface-secondary flex items-center justify-center overflow-hidden shrink-0 -mt-12 relative z-10 shadow-lg group-hover:border-accent transition-colors duration-300">
                  {token.profile?.logoUrl ? (
                    <img src={token.profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-bold text-accent font-mono">
                      {token.symbol?.slice(0, 3)}
                    </span>
                  )}
                </div>
                <div className="-mt-1.5 flex-1 min-w-0">
                  <h3 className="text-base font-bold title text-text-primary group-hover:text-accent transition-colors truncate">
                    {token.name} <span className="text-text-tertiary font-normal text-xs ml-1">({token.symbol})</span>
                  </h3>
                  <p className="text-xs text-text-secondary mt-1.5 font-medium tracking-wide">
                    {token.deploymentStatus === "CONFIRMED" ? (
                      <span className="text-success flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)] inline-block"></span> Deployed</span>
                    ) : (
                      <span className="text-warning flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning shadow-[0_0_8px_rgba(245,158,11,0.6)] inline-block"></span> Pending</span>
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
