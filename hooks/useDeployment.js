"use client";

import { useState, useCallback } from "react";

/**
 * Custom hook for managing token deployment flow state.
 */
export function useDeployment() {
  const [status, setStatus] = useState("idle"); // idle | simulating | deploying | confirmed | failed
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
    setTxHash(null);
  }, []);

  const simulate = useCallback(async (tokenId) => {
    setStatus("simulating");
    setError(null);
    try {
      const res = await fetch("/api/tokens/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Simulation failed");
      }
      return await res.json();
    } catch (err) {
      setError(err.message);
      setStatus("failed");
      throw err;
    }
  }, []);

  const deploy = useCallback(async (tokenId) => {
    setStatus("deploying");
    setError(null);
    try {
      const res = await fetch("/api/tokens/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tokenId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Deployment failed");
      }
      const data = await res.json();
      setTxHash(data.txHash);
      setStatus("confirmed");
      return data;
    } catch (err) {
      setError(err.message);
      setStatus("failed");
      throw err;
    }
  }, []);

  return {
    status,
    error,
    txHash,
    isSimulating: status === "simulating",
    isDeploying: status === "deploying",
    isConfirmed: status === "confirmed",
    isFailed: status === "failed",
    simulate,
    deploy,
    reset,
  };
}
