"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import { 
  CheckmarkBadge01Icon, 
  Cancel01Icon,
  ArrowRight01Icon,
  Search01Icon 
} from "hugeicons-react";

export default function AdminTokensPage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();
  const [tokens, setTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const loadTokens = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        status: statusFilter,
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/tokens?${params}`, {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) {
        setTokens(data.tokens);
        setPagination(data.pagination);
      }
    } catch (err) {
      addToast({ variant: "error", message: "Failed to load tokens" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadTokens();
  }, [address, statusFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadTokens(1);
  };

  const handleAction = async (tokenId, action, status) => {
    try {
      const res = await fetch("/api/admin/tokens", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({ tokenId, action, status }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ variant: "success", message: `${action} status updated to ${status}` });
        loadTokens(pagination.page);
      } else {
        addToast({ variant: "error", message: data.message || "Update failed" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Failed to update" });
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      CONFIRMED: "success", PENDING: "warning", FAILED: "error",
      VERIFIED: "success", PUBLISHED: "success",
      NOT_REQUESTED: "neutral",
    };
    return <Badge variant={map[status] || "neutral"} size="sm">{status || "N/A"}</Badge>;
  };

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Token Management</h1>
        <p className="text-sm text-text-secondary mt-1">
          View all deployed tokens. Approve verification requests and publish metadata.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            placeholder="Search by name, symbol, or contract..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button variant="secondary" size="md" type="submit">Search</Button>
        </form>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 bg-surface-primary border border-border-secondary rounded text-sm text-text-primary"
        >
          <option value="ALL">All Statuses</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Tokens Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : tokens.length === 0 ? (
        <div className="bg-surface-primary border border-border-primary rounded-xl p-12 text-center">
          <p className="text-text-secondary">No tokens found.</p>
        </div>
      ) : (
        <div className="bg-surface- border border-border-primary rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border-primary bg-surface-secondary">
                <tr>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary ">Token</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Deployer</th>
                  <th className="text-center title px-4 py-3 text-sm text-text-secondary">Deploy</th>
                  <th className="text-center title px-4 py-3 text-sm text-text-secondary">Verification</th>
                  <th className="text-center title px-4 py-3 text-sm text-text-secondary">Metadata</th>
                  <th className="text-center title px-4 py-3 text-sm text-text-secondary">Payments</th>
                  <th className="text-right title px-4 py-3 text-sm text-text-secondary">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {tokens.map((token) => {
                  const paidVerification = token.payments?.some(p => p.serviceType === "VERIFICATION" && p.status === "CONFIRMED");
                  const paidMetadata = token.payments?.some(p => p.serviceType === "METADATA" && p.status === "CONFIRMED");
                  return (
                    <tr key={token.id} className="hover:bg-surface-secondary/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-tertiary border border-border-secondary flex items-center justify-center overflow-hidden shrink-0">
                            {token.profile?.logoUrl ? (
                              <img src={token.profile.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] font-bold text-accent">{token.symbol?.slice(0, 3)}</span>
                            )}
                          </div>
                          <div>
                            <span className="font-semibold text-text-primary">{token.name}</span>
                            <span className="text-text-tertiary text-xs ml-1.5">${token.symbol}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-text-secondary">
                          {token.deployer?.walletAddress?.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">{getStatusBadge(token.deploymentStatus)}</td>
                      <td className="px-4 py-3 text-center">{getStatusBadge(token.verificationStatus)}</td>
                      <td className="px-4 py-3 text-center">{getStatusBadge(token.metadataStatus)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {paidVerification && <Badge variant="success" size="sm">V</Badge>}
                          {paidMetadata && <Badge variant="success" size="sm">M</Badge>}
                          {!paidVerification && !paidMetadata && <span className="text-xs text-text-tertiary">—</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {/* Verification Actions */}
                          {token.verificationStatus === "PENDING" && paidVerification && (
                            <>
                              <button
                                onClick={() => handleAction(token.id, "verification", "VERIFIED")}
                                className="p-1.5 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors"
                                title="Approve Verification"
                              >
                                <CheckmarkBadge01Icon size={16} variant="solid" />
                              </button>
                              <button
                                onClick={() => handleAction(token.id, "verification", "FAILED")}
                                className="p-1.5 rounded-md bg-error/10 text-error hover:bg-error/20 transition-colors"
                                title="Reject Verification"
                              >
                                <Cancel01Icon size={16} variant="solid" />
                              </button>
                            </>
                          )}

                          {/* Metadata Actions */}
                          {token.metadataStatus === "PENDING" && paidMetadata && (
                            <button
                              onClick={() => handleAction(token.id, "metadata", "PUBLISHED")}
                              className="p-1.5 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                              title="Publish Metadata"
                            >
                              <ArrowRight01Icon size={16} variant="solid" />
                            </button>
                          )}

                          <Link
                            href={`/t/${token.symbol?.toLowerCase()}`}
                            className="p-1.5 rounded-md bg-surface-tertiary text-text-tertiary hover:text-text-primary transition-colors"
                            title="View Token"
                          >
                            <ArrowRight01Icon size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-primary bg-surface-secondary">
              <span className="text-xs text-text-tertiary">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => loadTokens(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => loadTokens(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
