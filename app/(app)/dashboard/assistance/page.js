"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { useToastContext } from "@/components/ToastProvider";

const STATUS_VARIANTS = {
  PENDING: "warning",
  REVIEWING: "accent",
  APPROVED: "success",
  REJECTED: "error",
  COMPLETED: "success",
};

export default function UserAssistancePage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();
  const router = useRouter();
  
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    const loadRequests = async () => {
      try {
        const res = await fetch("/api/assistance", {
          headers: { "x-wallet-address": address },
        });
        const data = await res.json();
        if (data.success) {
          setRequests(data.requests);
        }
      } catch (err) {
        console.error("Failed to load assistance requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [address]);

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 space-y-4 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-64 mb-8" />
        {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-48" />)}
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl title text-text-primary">My Assistance Requests</h1>
        <p className="text-sm text-text-secondary mt-1">
          Track the status of your BNB gas sponsorship requests.
        </p>
      </div>

      {!address ? (
        <div className="text-center py-16 border border-dashed border-border-primary rounded-xl">
          <p className="text-text-secondary text-sm">Please connect your wallet to view your requests.</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border-primary rounded-xl bg-surface-primary">
          <p className="text-text-secondary text-sm">You haven't submitted any assistance requests.</p>
          <Button 
            variant="primary" 
            className="mt-4 cta"
            onClick={() => router.push("/dashboard/create")}
          >
            Create a Token
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {requests.map((req) => (
            <div key={req.id} className="bg-surface-primary card border border-border-primary rounded-xl overflow-hidden">
              <div className="p-6 border-b border-border-secondary flex flex-wrap items-center justify-between gap-4 bg-surface-secondary/50">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-text-primary">
                      {req.tokenData?.name || "Unknown Token"} <span className="text-text-tertiary font-normal">({req.tokenData?.symbol || "N/A"})</span>
                    </h3>
                    <Badge variant={STATUS_VARIANTS[req.status]} size="sm">{req.status}</Badge>
                  </div>
                  <p className="text-xs text-text-tertiary">
                    Requested on {new Date(req.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {req.status === "APPROVED" && (
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/dashboard/create?assistanceId=${req.id}`)}
                    className="bg-success text-success-text hover:bg-success-hover"
                  >
                    Deploy Approved Token
                  </Button>
                )}
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Project Description</h4>
                    <p className="text-sm text-text-secondary leading-relaxed bg-surface-secondary p-4 rounded-lg">
                      {req.description}
                    </p>
                  </div>
                  
                  {req.adminNotes && (
                    <div>
                      <h4 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">Message from Admin</h4>
                      <div className="text-sm text-text-secondary leading-relaxed bg-accent/5 border border-accent/20 p-4 rounded-lg">
                        {req.adminNotes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
