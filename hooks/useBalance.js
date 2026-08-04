"use client";

import { useBalance as useWagmiBalance } from "wagmi";
import { formatEther } from "viem";

/**
 * Custom hook for reading wallet BNB balance.
 * Returns formatted balance and loading/error states.
 */
export function useBalance() {
  const { data, isLoading, isError, error, refetch } = useWagmiBalance();

  const formatted = data ? formatEther(data.value) : "0";
  const symbol = data?.symbol || "BNB";

  return {
    balance: data?.value,
    formatted,
    symbol,
    isLoading,
    isError,
    error,
    refetch,
  };
}
