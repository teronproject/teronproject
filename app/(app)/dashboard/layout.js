"use client";

import { useWallet } from "@/hooks/useWallet";
import { LockPasswordIcon } from "hugeicons-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/dashboard/Sidebar";
import WalletButton from "@/components/WalletButton";
import Footer from "@/components/shared/Footer";

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
      <>
      <div className="max-w-3xl mx-auto py-32 px-4 text-center space-y-6 min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-surface-secondary border border-border-secondary rounded-full flex items-center justify-center text-text-tertiary shadow-sm">
          <LockPasswordIcon size={36} variant="stroke-rounded" />
        </div>
        <div>
          <h1 className="text-2xl font-bold title text-text-primary mb-2">
            Connect Wallet to Access
          </h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            You need to connect your Web3 wallet to deploy new tokens, manage existing ones, and view your dashboard.
          </p>
        </div>
        <div className="pt-2">
          <WalletButton />
        </div>

        <div className="pt-8 max-w-sm mx-auto text-xs text-text-tertiary leading-relaxed border-t border-dashed border-white/5 space-y-3 text-left">
          <p>
            <strong className="text-text-secondary font-semibold">Important Note:</strong> Connect the exact wallet you intend to use as the owner of your token. You will need a small amount of BNB in this wallet to cover standard network gas fees during deployment.
          </p>
          <p>
            By connecting your wallet and using the Teron dashboard, you acknowledge that you have read and agree to our{" "}
            <Link href="/legal/terms" className="text-text-secondary hover:text-white underline decoration-white/20 underline-offset-2 transition-colors">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-text-secondary hover:text-white underline decoration-white/20 underline-offset-2 transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </div>
      </div>
      <Footer/>
      </>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-64px)] w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 w-full overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}
