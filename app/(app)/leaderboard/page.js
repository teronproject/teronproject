"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

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
          limit: "12",
          status: statusFilter,
          ...(searchTerm.trim() && { search: searchTerm.trim() }),
        });
        const res = await fetch(`/api/tokens/list?${params.toString()}`);
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
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-primary">
        <div className="space-y-2">
          <Badge variant="accent" size="md">EXPLORE & DISCOVER</Badge>
          <h1 className="text-3xl font-extrabold text-text-primary">Teron Token Leaderboard</h1>
          <p className="text-text-secondary text-sm max-w-2xl">
            Real-time directory of BEP-20 tokens deployed cleanly and immutably on the BNB Smart Chain through Teron.
          </p>
        </div>
        <Link href="/dashboard/create" className="h-11 px-6 bg-accent text-accent-text font-bold rounded-lg inline-flex items-center justify-center hover:bg-accent-hover transition-all shadow-md shrink-0">
          + Deploy New Token
        </Link>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-primary p-4 rounded-xl border border-border-primary">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by name, symbol, or address..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1); // Reset page on search
            }}
            className="w-full h-10 px-4 bg-surface-secondary border border-border-secondary rounded-lg text-sm text-text-primary placeholder:text-text-disabled focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-semibold text-text-tertiary uppercase mr-1">Filter:</span>
          <button
            onClick={() => { setStatusFilter("CONFIRMED"); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              statusFilter === "CONFIRMED"
                ? "bg-accent text-accent-text"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            Verified On-Chain
          </button>
          <button
            onClick={() => { setStatusFilter("ALL"); setPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${
              statusFilter === "ALL"
                ? "bg-accent text-accent-text"
                : "bg-surface-secondary text-text-secondary hover:text-text-primary"
            }`}
          >
            All Deployments
          </button>
        </div>
      </div>

      {/* Token Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, idx) => (
            <Skeleton key={idx} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : tokens.length === 0 ? (
        <div className="bg-surface-secondary border border-dashed border-border-primary rounded-2xl p-16 text-center space-y-6 max-w-2xl mx-auto">
          <div className="text-6xl opacity-30">🪙</div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-text-primary">No Tokens Found</h2>
            <p className="text-text-secondary text-sm">
              {searchTerm
                ? `No deployed tokens matched your search query "${searchTerm}". Try a different term or adjust filters.`
                : "Be the first creator on the Teron platform! Launch your BEP-20 token in just a few minutes."}
            </p>
          </div>
          <div className="pt-2">
            {searchTerm ? (
              <Button variant="secondary" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            ) : (
              <Link href="/dashboard/create" className="h-11 px-8 bg-accent text-accent-text font-bold rounded-lg inline-flex items-center hover:bg-accent-hover transition-colors shadow-lg">
                Launch First Token
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((t) => {
            const prof = t.profile || {};
            const isConfirmed = t.deploymentStatus === "CONFIRMED";

            return (
              <Link
                key={t.id}
                href={`/t/${t.symbol ? t.symbol.toLowerCase() : t.id}`}
                className="group block bg-surface-secondary border border-border-primary rounded-xl overflow-hidden hover:border-accent hover:shadow-lg transition-all duration-200"
              >
                {/* Card Banner */}
                <div className="h-20 w-full bg-gradient-to-r from-bg-secondary via-surface-tertiary to-bg-secondary relative overflow-hidden">
                  {prof.bannerUrl && (
                    <img src={prof.bannerUrl} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={isConfirmed ? "success" : "warning"} size="sm">
                      {isConfirmed ? "✓ On-Chain" : t.deploymentStatus}
                    </Badge>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 pt-0 relative">
                  {/* Logo Avatar Overlap */}
                  <div className="w-14 h-14 rounded-full border-2 border-surface-secondary bg-surface-primary -mt-7 mb-3 overflow-hidden flex items-center justify-center shadow-md shrink-0">
                    {prof.logoUrl ? (
                      <img src={prof.logoUrl} alt={t.symbol} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-mono text-lg font-bold text-accent">
                        {t.symbol ? t.symbol.slice(0, 3).toUpperCase() : "T"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold text-base text-text-primary group-hover:text-accent transition-colors truncate">
                        {t.name}
                      </h3>
                      <span className="text-xs font-mono font-bold text-text-tertiary uppercase shrink-0">
                        ${t.symbol}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2 min-h-[32px]">
                      {prof.shortDescription || "No short description provided by the deployer."}
                    </p>
                  </div>

                  {/* Card Footer / Specs */}
                  <div className="pt-3 border-t border-border-primary flex items-center justify-between text-xs font-mono text-text-tertiary">
                    <span>Supply: <strong className="text-text-secondary">{t.totalSupply}</strong></span>
                    <span>Decimals: <strong className="text-text-secondary">{t.decimals}</strong></span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-4 border-t border-border-primary">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            &larr; Previous
          </Button>
          <span className="text-xs text-text-secondary font-medium">
            Page <strong className="text-text-primary">{page}</strong> of <strong className="text-text-primary">{pagination.totalPages}</strong>
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
            disabled={page >= pagination.totalPages}
          >
            Next &rarr;
          </Button>
        </div>
      )}
    </div>
  );
}
