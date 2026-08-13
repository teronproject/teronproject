"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";

const STATUS_VARIANTS = {
  PENDING: "warning",
  SIMULATING: "accent",
  DEPLOYING: "accent",
  DEPLOYED: "accent",
  CONFIRMED: "success",
  FAILED: "error",
};

const PAYMENT_STATUS_VARIANTS = {
  PENDING: "warning",
  CONFIRMED: "accent",
  COMPLETED: "success",
  FAILED: "error",
  REFUNDED: "accent",
};

function truncateAddr(addr) {
  if (!addr) return "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function DeploymentsPaymentsPage() {
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState("deployments");
  const [deployments, setDeployments] = useState([]);
  const [deployStats, setDeployStats] = useState({});
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({});
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) return;

    const load = async () => {
      setIsLoading(true);
      try {
        const [depRes, payRes] = await Promise.all([
          fetch("/api/admin/deployments", { headers: { "x-wallet-address": address } }),
          fetch("/api/admin/payments", { headers: { "x-wallet-address": address } }),
        ]);

        const depData = await depRes.json();
        const payData = await payRes.json();

        if (depData.success) {
          setDeployments(depData.deployments);
          setDeployStats(depData.byStatus || {});
        }
        if (payData.success) {
          setPayments(payData.payments);
          setPaymentStats(payData.byStatus || {});
          setTotalRevenue(payData.totalRevenueBnb || 0);
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [address]);

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl title text-text-primary">Deployments & Payments</h1>
        <p className="text-sm text-text-secondary mt-1">
          Track all contract deployments and payment transactions to the cold wallet.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
          <p className="text-sm text-text-secondary">Total Deployments</p>
          <p className="text-2xl font-extrabold text-text-primary mt-1">{deployments.length}</p>
        </div>
        <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
          <p className="text-sm text-text-secondary">Confirmed</p>
          <p className="text-2xl font-extrabold text-success mt-1">{deployStats.CONFIRMED || 0}</p>
        </div>
        <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
          <p className="text-sm text-text-secondary">Total Payments</p>
          <p className="text-2xl font-extrabold text-text-primary mt-1">{payments.length}</p>
        </div>
        <div className="bg-surface-primary card border border-border-primary rounded-xl p-5">
          <p className="text-sm text-text-secondary">Revenue (BNB)</p>
          <p className="text-2xl font-extrabold text-accent mt-1">{totalRevenue.toFixed(4)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-primary mb-6">
        <button
          onClick={() => setActiveTab("deployments")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "deployments" ? "border-accent text-accent" : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Deployments ({deployments.length})
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "payments" ? "border-accent text-accent" : "border-transparent text-text-secondary hover:text-text-primary"
          }`}
        >
          Payments ({payments.length})
        </button>
      </div>

      {/* Deployments Tab */}
      {activeTab === "deployments" && (
        <div className="bg-surface-primary border border-border-primary rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border-primary bg-surface-secondary">
                <tr>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Token</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Deployer</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Contract</th>
                  <th className="text-center title px-4 py-3 text-sm text-text-secondary">Status</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Gas Used</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {deployments.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-text-secondary">No deployments found.</td></tr>
                ) : deployments.map((dep) => (
                  <tr key={dep.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary">{dep.token?.name || "—"}</p>
                      <p className="text-xs text-text-tertiary">{dep.token?.symbol}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{truncateAddr(dep.user?.walletAddress)}</td>
                    <td className="px-4 py-3">
                      {dep.contractAddress ? (
                        <a href={`https://bscscan.com/address/${dep.contractAddress}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-accent hover:underline">
                          {truncateAddr(dep.contractAddress)}
                        </a>
                      ) : <span className="text-xs text-text-tertiary">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={STATUS_VARIANTS[dep.status] || "accent"} size="sm">{dep.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-text-secondary font-mono">{dep.gasUsed || "—"}</td>
                    <td className="px-4 py-3 text-xs text-text-tertiary">{new Date(dep.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === "payments" && (
        <div className="bg-surface-primary border border-border-primary rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border-primary bg-surface-secondary">
                <tr>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Token</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">User</th>
                  <th className="text-center title px-4 py-3 text-sm text-text-secondary">Service</th>
                  <th className="text-right title px-4 py-3 text-sm text-text-secondary">Amount (BNB)</th>
                  <th className="text-center title px-4 py-3 text-sm text-text-secondary">Status</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Tx Hash</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Cold Wallet</th>
                  <th className="text-left title px-4 py-3 text-sm text-text-secondary">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {payments.length === 0 ? (
                  <tr><td colSpan={8} className="text-center py-12 text-text-secondary">No payments found.</td></tr>
                ) : payments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-text-primary text-xs">{pay.token?.name || "—"}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{truncateAddr(pay.user?.walletAddress)}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant="accent" size="sm">{pay.serviceType}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-bold text-accent">{pay.amountBnb}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={PAYMENT_STATUS_VARIANTS[pay.status] || "accent"} size="sm">{pay.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {pay.txHash ? (
                        <a href={`https://bscscan.com/tx/${pay.txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-accent hover:underline">
                          {truncateAddr(pay.txHash)}
                        </a>
                      ) : <span className="text-xs text-text-tertiary">—</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-secondary">{truncateAddr(pay.coldWalletAddress)}</td>
                    <td className="px-4 py-3 text-xs text-text-tertiary">{new Date(pay.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
