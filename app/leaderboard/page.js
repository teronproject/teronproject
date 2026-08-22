"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Button from "@/components/ui/Button";
import { Search01Icon, CrownIcon, ArrowRight01Icon, Coins01Icon, Calendar01Icon, Shield01Icon } from "hugeicons-react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import MaintenanceGuard from "@/components/shared/MaintenanceGuard";

export default function LeaderboardPage() {
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("CONFIRMED"); // 'CONFIRMED' or 'ALL'
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  useEffect(() => {
    async function fetchTokens() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "15", // Adjusted to 15 for a better list view
          status: statusFilter,
          ...(searchTerm.trim() && { search: searchTerm.trim() }),
        });
        const res = await fetch(`/api/projects/list?${params.toString()}`);
        const data = await res.json();
        if (res.ok) {
          setTokens(data.tokens || []);
          if (data.pagination) setPagination(data.pagination);
        }
      } catch (err) {
        console.error("Error fetching leaderboard tokens:", err);
      } finally {
        setIsLoading(false);
      }
    }

    // Debounce search
    const timer = setTimeout(() => {
      fetchTokens();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, page]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <MaintenanceGuard featureKey="leaderboard">
        <div className="py-16 px-4 min-h-[70vh] sm:px-6 lg:px-8 space-y-12 relative z-10 w-full">
      {/* Header Section */}
      <div className="flex flex-col items-left text-left space-y-3">
        <h1 className="text-3xl text-text-primary title">
          Teron Leaderboard
        </h1>
        <p className="text-text-secondary text-sm text-balance max-w-xl">
          The definitive directory of top-tier BEP-20 tokens deployed immutably on the BNB Smart Chain.
        </p>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-secondary/50 backdrop-blur-md p-2 rounded-2xl border border-border-primary/50 shadow-sm">
        <div className="w-full sm:w-96 relative group">
          <Search01Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search by name, symbol, or address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full h-12 pl-12 pr-4 bg-transparent border-none text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-0"
          />
        </div>

        <div className="flex items-center gap-2 p-2 bg-surface-primary/50 rounded-xl">
          <button
            onClick={() => { setStatusFilter("CONFIRMED"); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              statusFilter === "CONFIRMED"
                ? "bg-accent cta text-accent-text shadow-[0_0_10px_rgba(var(--color-accent),0.2)]"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
          >
            Verified On-Chain
          </button>
          <button
            onClick={() => { setStatusFilter("ALL"); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
              statusFilter === "ALL"
                ? "bg-accent cta text-accent-text shadow-[0_0_10px_rgba(var(--color-accent),0.2)]"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
            }`}
          >
            All Deployments
          </button>
        </div>
      </div>

      {/* Token List View */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-2xl opacity-50" />
            ))}
          </div>
        ) : tokens.length === 0 ? (
          <div className="border border-dashed border-border-primary/50 bg-surface-secondary/20 backdrop-blur-sm rounded-3xl p-16 text-center space-y-6 max-w-2xl mx-auto">
            <div className="text-6xl opacity-30 drop-shadow-lg">🪙</div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-text-primary">No Tokens Found</h2>
              <p className="text-text-secondary text-sm">
                {searchTerm
                  ? `No deployed tokens matched your search query "${searchTerm}".`
                  : "The leaderboard is currently empty. Launch the first token!"}
              </p>
            </div>
            {!searchTerm && (
              <div className="pt-4">
                <Link href="/dashboard/create" className="h-12 px-8 bg-accent text-accent-text font-bold rounded-full inline-flex items-center hover:bg-accent-hover transition-all shadow-lg hover:shadow-accent/20">
                  Launch Token
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tokens.map((t, index) => {
              const prof = t.profile || {};
              const isConfirmed = t.deploymentStatus === "CONFIRMED";
              const rank = (page - 1) * 15 + index + 1;

              return (
                <Link
                  key={t.id}
                  href={`/t/${t.symbol ? t.symbol.toLowerCase() : t.id}`}
                  className="group relative flex items-center gap-4 sm:gap-6 bg-surface-secondary/40 backdrop-blur-sm border border-border-primary/30 p-4 rounded-2xl hover:bg-surface-secondary/80 hover:border-accent/40 transition-all duration-300 overflow-hidden card"
                >
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div> */}
                  
                  {/* Rank Indicator */}
                  <div className="flex flex-col items-center justify-center w-8 shrink-0">
                    {rank <= 3 ? (
                      <div className="relative w-8 h-8 sm:w-10 sm:h-10">
                        <Image
                          src={
                            rank === 1 ? "/leaderboard/Gold.png" :
                            rank === 2 ? "/leaderboard/Silver.png" :
                            "/leaderboard/Bronze.png"
                          }
                          alt={`Rank ${rank}`}
                          fill
                          className="object-contain drop-shadow-lg"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-text-tertiary">#{rank}</span>
                    )}
                  </div>

                  {/* Logo Avatar */}
                  <div className="w-14 h-14 rounded-full border border-border-secondary bg-surface-primary overflow-hidden flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(var(--color-accent),0.2)] transition-shadow">
                    {prof.logoUrl ? (
                      <img src={prof.logoUrl} alt={t.symbol} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-lg font-bold text-accent">
                        {t.symbol ? t.symbol.slice(0, 3).toUpperCase() : "T"}
                      </span>
                    )}
                  </div>

                  {/* Token Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-base text-text-primary group-hover:text-accent transition-colors truncate">
                        {t.name}
                      </h3>
                      <span className="text-[11px] font-mono font-bold text-text-primary bg-surface-primary px-2 py-0.5 rounded-full border border-border-secondary shrink-0">
                        ${t.symbol}
                      </span>
                      {isConfirmed && (
                        <Shield01Icon size={14} className="text-success shrink-0" variant="solid" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary truncate pr-4">
                      {prof.shortDescription || "Premium BEP-20 smart contract deployed on the BNB Chain."}
                    </p>
                  </div>

                  {/* Quick Specs (Desktop Only) */}
                  <div className="hidden md:flex items-center gap-8 shrink-0 text-xs text-text-tertiary mr-4">
                    <div className="flex flex-col gap-1 items-end">
                      <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-[9px]"><Coins01Icon size={12}/> Supply</span>
                      <span className="font-mono text-text-primary font-medium">{t.totalSupply}</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <span className="flex items-center gap-1.5 uppercase font-bold tracking-widest text-[9px]"><Calendar01Icon size={12}/> Deployed</span>
                      <span className="text-text-primary font-medium">
                        {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Action Icon */}
                  <div className="shrink-0 text-text-tertiary group-hover:text-accent transition-transform group-hover:translate-x-1 duration-300">
                    <ArrowRight01Icon size={20} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        </div>
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="hover:bg-surface-secondary/50"
          >
            &larr; Previous
          </Button>
          <span className="text-xs text-text-secondary font-medium bg-surface-secondary/30 px-4 py-1.5 rounded-full border border-border-primary/50">
            Page <strong className="text-text-primary">{page}</strong> of <strong className="text-text-primary">{pagination.totalPages}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
            disabled={page >= pagination.totalPages}
            className="hover:bg-surface-secondary/50"
          >
            Next &rarr;
          </Button>
        </div>
      )}

      {/* Premium Disclaimer Footer */}
      <div className="pt-24 pb-8 text-left max-w- space-y-2 px-4 sm:px-6 lg:px-8">
        <p className="text-xs text-text-tertiary leading-relaxed stitle">
          Leaderboard Data & Ranking Disclaimer
        </p>
        <p className="text-[11px] text-text-tertiary/60 leading-relaxed text-balance">
          The Teron Leaderboard displays BEP-20 tokens deployed via the Teron platform. Rankings are dynamic and may change based on verification status and platform metrics. Teron is a decentralized token deployment protocol; we do not manage, endorse, or guarantee the value, utility, or security of any listed token. Interacting with smart contracts involves inherent risks. Please Do Your Own Research (DYOR) and verify contract addresses directly on BscScan.
        </p>
      </div>
      </MaintenanceGuard>
    <Footer/>
    </div>
  );
}
