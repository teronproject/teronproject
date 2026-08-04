"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for checking feature flag status.
 *
 * @param {string} flagKey - The feature flag key to check
 * @param {boolean} [defaultValue=false] - Default value if flag is not found
 * @returns {{ enabled: boolean, isLoading: boolean }}
 */
export function useFeatureFlag(flagKey, defaultValue = false) {
  const [enabled, setEnabled] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  const checkFlag = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/admin/feature-flags?key=${encodeURIComponent(flagKey)}`
      );
      if (res.ok) {
        const data = await res.json();
        setEnabled(data.enabled ?? defaultValue);
      }
    } catch {
      setEnabled(defaultValue);
    } finally {
      setIsLoading(false);
    }
  }, [flagKey, defaultValue]);

  useEffect(() => {
    checkFlag();
  }, [checkFlag]);

  return { enabled, isLoading };
}
