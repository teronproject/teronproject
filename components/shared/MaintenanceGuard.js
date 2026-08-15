"use client";

import { useFeatureFlags } from "@/components/FeatureFlagProvider";
import Skeleton from "@/components/ui/Skeleton";
import { Settings02Icon } from "hugeicons-react";

export default function MaintenanceGuard({ featureKey, children, fallback }) {
  const { flags, isLoaded } = useFeatureFlags();

  if (!isLoaded) {
    return (
      <div className="py-12 px-4 sm:px-6 space-y-4 max-w-6xl mx-auto">
        <Skeleton className="h-10 w-64 mb-8" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  const isGlobalMaintenance = flags.maintenance_mode === true;
  const isFeatureEnabled = flags[featureKey] !== false; 

  if (!isGlobalMaintenance && isFeatureEnabled) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="py-24 px-4 sm:px-6 max-w-6xl mx-auto text-center">
      <div className="w-20 h-20 bg-surface-secondary border border-border-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm card">
        <Settings02Icon size={36} className="text-accent animate-spin-slow" />
      </div>
      <h2 className="text-3xl title text-text-primary mb-3">Under Maintenance</h2>
      <p className="text-text-secondary text-lg max-w-xl mx-auto">
        This feature is currently undergoing scheduled maintenance or updates to improve your experience. Please check back later.
      </p>
    </div>
  );
}
