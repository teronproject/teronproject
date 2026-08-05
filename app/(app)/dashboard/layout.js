"use client";

import { useWallet } from "@/hooks/useWallet";
import { LockPasswordIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  const { isConnected } = useWallet();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="min-h-[60vh]"></div>; // Hydration placeholder
  }

  if (!isConnected) {
    return (
      <div className="max-w-3xl mx-auto py-32 px-4 text-center space-y-6 min-h-[60vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-surface-secondary border border-border-secondary rounded-full flex items-center justify-center text-text-tertiary shadow-sm">
          <LockPasswordIcon size={36} variant="stroke-rounded" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Connect Wallet to Access
          </h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            You need to connect your Web3 wallet to deploy new tokens, manage existing ones, and view your dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
      <Sidebar />
      <main className="flex-1 w-full pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
