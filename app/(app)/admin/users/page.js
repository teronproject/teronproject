"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { UserMultiple02Icon } from "hugeicons-react";

export default function AdminUsersPage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const loadUsers = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/users?${params}`, {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (err) {
      addToast({ variant: "error", message: "Failed to load users" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadUsers();
  }, [address]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadUsers(1);
  };

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <UserMultiple02Icon className="text-accent" variant="solid" size={28} />
          User Management
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          All wallets that have connected to Teron. Total: {pagination.total}
        </p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-lg">
        <Input
          placeholder="Search by wallet, name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="secondary" size="md" type="submit">Search</Button>
      </form>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-surface-primary border border-border-primary rounded-xl p-12 text-center">
          <p className="text-text-secondary">No users found.</p>
        </div>
      ) : (
        <div className="bg-surface-primary border border-border-primary rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border-primary bg-surface-secondary">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-text-tertiary uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-text-tertiary uppercase tracking-wider">Wallet</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-text-tertiary uppercase tracking-wider">Role</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-text-tertiary uppercase tracking-wider">Tokens</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-text-tertiary uppercase tracking-wider">Payments</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-text-tertiary uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-tertiary border border-border-secondary flex items-center justify-center overflow-hidden shrink-0">
                          {user.avatar ? (
                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] font-bold text-accent">
                              {user.walletAddress?.slice(2, 4).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="font-semibold text-text-primary text-sm">
                            {user.displayName || "Anonymous"}
                          </span>
                          {user.email && (
                            <p className="text-xs text-text-tertiary">{user.email}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-text-secondary">
                        {user.walletAddress?.slice(0, 10)}...{user.walletAddress?.slice(-6)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        variant={user.role === "ADMIN" ? "error" : "neutral"}
                        size="sm"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-text-primary">{user._count?.tokens || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-semibold text-text-primary">{user._count?.payments || 0}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-xs text-text-tertiary">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border-primary bg-surface-secondary">
              <span className="text-xs text-text-tertiary">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => loadUsers(pagination.page - 1)} disabled={pagination.page <= 1}>Previous</Button>
                <Button variant="secondary" size="sm" onClick={() => loadUsers(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
