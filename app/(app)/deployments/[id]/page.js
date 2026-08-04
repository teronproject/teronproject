"use client";

import { useEffect, useState, use } from "react";
import { useDeployContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Skeleton from "@/components/ui/Skeleton";
import { BEP20_ABI, BEP20_BYTECODE } from "@/lib/contracts/bep20";
import Link from "next/link";

export default function DeploymentStatusPage({ params }) {
  // Unwrap params in Next.js 15/16 App Router
  const resolvedParams = use(params);
  const deploymentId = resolvedParams.id;

  const [deploymentData, setDeploymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState("PENDING");
  const [contractAddr, setContractAddr] = useState(null);

  const { address, isConnected, isBnbChain, chain } = useWallet();
  const { addToast } = useToastContext();

  // Wagmi Contract Deployment hook
  const {
    deployContract,
    data: txHash,
    isPending: isDeployingWallet,
    error: deployError,
  } = useDeployContract();

  // Wait for On-Chain Transaction Receipt
  const {
    data: receipt,
    isLoading: isConfirmingChain,
    isSuccess: isConfirmedChain,
    error: receiptError,
  } = useWaitForTransactionReceipt({
    hash: txHash || undefined,
  });

  // Fetch deployment metadata on initial load
  useEffect(() => {
    async function fetchDeployment() {
      try {
        const res = await fetch(`/api/deployments/${deploymentId}`);
        const data = await res.json();
        if (res.ok && data.deployment) {
          setDeploymentData(data.deployment);
          setDbStatus(data.deployment.status);
          if (data.deployment.token?.contractAddress) {
            setContractAddr(data.deployment.token.contractAddress);
          }
        } else {
          addToast({ variant: "error", message: data.message || "Failed to load deployment" });
        }
      } catch (err) {
        addToast({ variant: "error", message: "Error loading deployment details" });
      } finally {
        setIsLoading(false);
      }
    }

    if (deploymentId) fetchDeployment();
  }, [deploymentId]);

  // Handle wallet deployment error
  useEffect(() => {
    if (deployError) {
      addToast({ variant: "error", message: deployError.shortMessage || deployError.message });
      updateStatus("FAILED", { errorMessage: deployError.message });
    }
  }, [deployError]);

  // When tx Hash is available (broadcasted to network)
  useEffect(() => {
    if (txHash && dbStatus !== "CONFIRMED") {
      updateStatus("DEPLOYING", { txHash });
      addToast({ variant: "info", message: "Transaction broadcasted! Waiting for blockchain confirmation..." });
    }
  }, [txHash]);

  // When transaction receipt is confirmed on chain
  useEffect(() => {
    if (isConfirmedChain && receipt) {
      const newContractAddress = receipt.contractAddress;
      setContractAddr(newContractAddress);
      updateStatus("CONFIRMED", { txHash, contractAddress: newContractAddress });
      addToast({ variant: "success", message: "Token successfully deployed on BNB Chain!" });
    } else if (receiptError) {
      updateStatus("FAILED", { errorMessage: receiptError.message });
      addToast({ variant: "error", message: "Transaction failed on blockchain." });
    }
  }, [isConfirmedChain, receipt, receiptError]);

  const updateStatus = async (status, extra = {}) => {
    setDbStatus(status);
    try {
      await fetch(`/api/deployments/${deploymentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...extra }),
      });
    } catch (e) {
      console.error("Failed to update status in database:", e);
    }
  };

  const handleTriggerDeploy = () => {
    if (!isConnected) {
      addToast({ variant: "error", message: "Please connect your wallet first." });
      return;
    }
    if (!isBnbChain) {
      addToast({ variant: "error", message: "Please switch your wallet to BNB Chain." });
      return;
    }

    const token = deploymentData?.token;
    if (!token) return;

    try {
      // Calculate supply with exact decimals using BigInt
      const rawSupply = parseUnits(token.totalSupply.toString(), token.decimals);

      deployContract({
        abi: BEP20_ABI,
        bytecode: BEP20_BYTECODE,
        args: [
          token.name,
          token.symbol,
          rawSupply,
          token.decimals,
          address, // initialOwner
        ],
        gas: 3000000n, // Hardcoded gas limit to bypass wallet estimation issues
      });
    } catch (err) {
      addToast({ variant: "error", message: "Failed to format contract arguments: " + err.message });
    }
  };

  const getBscScanUrl = (targetAddress, isTx = false) => {
    const baseUrl = "https://bscscan.com";
    return `${baseUrl}/${isTx ? "tx" : "address"}/${targetAddress}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-6">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!deploymentData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <h2 className="text-xl font-bold text-text-primary">Deployment Session Not Found</h2>
        <p className="text-text-secondary text-sm mt-2">The requested deployment ID does not exist.</p>
        <Link href="/create" className="inline-block mt-6 text-accent hover:underline">
          &larr; Launch a New Token
        </Link>
      </div>
    );
  }

  const { token } = deploymentData;
  const isComplete = dbStatus === "CONFIRMED";
  const isInProgress = isDeployingWallet || isConfirmingChain || dbStatus === "DEPLOYING" || dbStatus === "SIMULATING";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-primary pb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Smart Contract Deployment</h1>
          <p className="text-text-secondary text-sm">
            Deployment Session ID: <span className="font-mono text-xs">{deploymentId}</span>
          </p>
        </div>
        <div>
          {dbStatus === "PENDING" && <Badge variant="warning" size="md">Ready to Deploy</Badge>}
          {(dbStatus === "SIMULATING" || dbStatus === "DEPLOYING") && <Badge variant="accent" size="md">Deploying to Chain...</Badge>}
          {dbStatus === "CONFIRMED" && <Badge variant="success" size="md">Confirmed on Chain</Badge>}
          {dbStatus === "FAILED" && <Badge variant="error" size="md">Deployment Failed</Badge>}
        </div>
      </div>

      {/* Main Action Banner */}
      {isComplete ? (
        <div className="bg-success-subtle border border-success/30 rounded-xl p-6 text-center space-y-4">
          <div className="w-16 h-16 bg-success text-white text-3xl font-bold rounded-full flex items-center justify-center mx-auto shadow-lg">
            ✓
          </div>
          <h2 className="text-xl font-bold text-text-primary">Token Successfully Deployed!</h2>
          <p className="text-text-secondary text-sm max-w-lg mx-auto">
            Your token <strong className="text-text-primary">{token.name} ({token.symbol})</strong> has been permanently written to the BNB Smart Chain.
          </p>
          {contractAddr && (
            <div className="p-4 bg-surface-primary border border-border-secondary rounded-lg inline-block max-w-full overflow-hidden text-left">
              <p className="text-xs text-text-tertiary font-semibold uppercase mb-1">BEP-20 Contract Address</p>
              <a
                href={getBscScanUrl(contractAddr)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-sm text-accent hover:underline break-all block"
              >
                {contractAddr} ↗
              </a>
            </div>
          )}
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <Link href={`/t/${token.symbol.toLowerCase()}`} className="h-10 px-6 bg-accent text-accent-text font-semibold rounded inline-flex items-center text-sm hover:bg-accent-hover transition-colors">
              View Token Profile
            </Link>
            {txHash && (
              <a
                href={getBscScanUrl(txHash, true)}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-6 bg-surface-primary border border-border-secondary text-text-primary font-semibold rounded inline-flex items-center text-sm hover:bg-surface-secondary transition-colors"
              >
                View on BscScan
              </a>
            )}
          </div>
        </div>
      ) : (
        <Card className="p-8 space-y-6 bg-surface-secondary">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-accent-subtle flex items-center justify-center text-accent text-2xl">
              🚀
            </div>
            <h2 className="text-lg font-bold text-text-primary">Ready to Broadcast to BNB Chain</h2>
            <p className="text-text-secondary text-sm max-w-md">
              Click below to initiate the wallet signature. MetaMask or your connected Web3 wallet will prompt you to approve the deployment gas fee.
            </p>
          </div>

          {/* Progress Indicator */}
          {isInProgress && (
            <div className="p-4 bg-surface-primary border border-border-primary rounded-lg space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="text-sm font-medium text-text-primary">
                  {isDeployingWallet
                    ? "Waiting for wallet signature..."
                    : isConfirmingChain
                    ? "Transaction broadcasted! Waiting for block inclusion on BNB Chain..."
                    : "Processing deployment..."}
                </span>
              </div>
              {txHash && (
                <p className="text-xs font-mono text-text-tertiary pl-8 truncate">
                  Tx Hash: <a href={getBscScanUrl(txHash, true)} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{txHash} ↗</a>
                </p>
              )}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              size="lg"
              variant="primary"
              onClick={handleTriggerDeploy}
              disabled={isInProgress || !isConnected || !isBnbChain}
              isLoading={isInProgress}
              className="w-full sm:w-auto min-w-[240px]"
            >
              {!isConnected
                ? "Connect Wallet to Deploy"
                : !isBnbChain
                ? "Switch to BNB Chain"
                : isDeployingWallet
                ? "Check Wallet..."
                : isConfirmingChain
                ? "Confirming on Chain..."
                : "Sign & Deploy to Blockchain"}
            </Button>
          </div>
        </Card>
      )}

      {/* Token Spec Review Box */}
      <Card>
        <Card.Header className="bg-surface-primary">
          <h3 className="font-semibold text-text-primary text-sm">Immutable Contract Parameters</h3>
        </Card.Header>
        <Card.Body className="divide-y divide-border-primary">
          <div className="py-3 flex justify-between items-center text-sm">
            <span className="text-text-secondary">Token Name</span>
            <span className="font-semibold text-text-primary">{token.name}</span>
          </div>
          <div className="py-3 flex justify-between items-center text-sm">
            <span className="text-text-secondary">Token Symbol</span>
            <span className="font-semibold text-text-primary">{token.symbol}</span>
          </div>
          <div className="py-3 flex justify-between items-center text-sm">
            <span className="text-text-secondary">Decimals</span>
            <span className="font-semibold text-text-primary">{token.decimals}</span>
          </div>
          <div className="py-3 flex justify-between items-center text-sm">
            <span className="text-text-secondary">Initial Supply</span>
            <span className="font-semibold text-text-primary">{token.totalSupply}</span>
          </div>
          <div className="py-3 flex justify-between items-center text-sm">
            <span className="text-text-secondary">Target Network</span>
            <span className="font-mono text-xs bg-surface-tertiary px-2 py-1 rounded text-accent">
              BNB Smart Chain Mainnet (56)
            </span>
          </div>
          <div className="py-3 flex justify-between items-center text-sm">
            <span className="text-text-secondary">Initial Owner & Deployer</span>
            <span className="font-mono text-xs text-text-primary truncate max-w-[200px] sm:max-w-md">
              {token.deployer?.walletAddress || address || "N/A"}
            </span>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}
