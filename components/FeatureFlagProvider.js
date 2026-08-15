"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FeatureFlagContext = createContext({});

export function FeatureFlagProvider({ children }) {
  const [flags, setFlags] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const res = await fetch("/api/feature-flags");
        const data = await res.json();
        if (data.success) {
          setFlags(data.flags);
        }
      } catch (error) {
        console.error("Failed to fetch feature flags:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    fetchFlags();
  }, []);

  return (
    <FeatureFlagContext.Provider value={{ flags, isLoaded }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlags() {
  return useContext(FeatureFlagContext);
}
