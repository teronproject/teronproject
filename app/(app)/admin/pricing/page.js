"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import Badge from "@/components/ui/Badge";
import { MoneyBag02Icon } from "hugeicons-react";

export default function AdminPricingPage() {
  const { address } = useWallet();
  const { addToast } = useToastContext();
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingKey, setEditingKey] = useState(null);
  const [editValues, setEditValues] = useState({});

  const loadPricing = async () => {
    try {
      const res = await fetch("/api/admin/pricing", {
        headers: { "x-wallet-address": address },
      });
      const data = await res.json();
      if (data.success) setConfigs(data.configs);
    } catch (err) {
      addToast({ variant: "error", message: "Failed to load pricing" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) loadPricing();
  }, [address]);

  const startEdit = (config) => {
    setEditingKey(config.serviceKey);
    setEditValues({
      priceUsd: config.priceUsd?.toString() || "",
      label: config.label || "",
    });
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValues({});
  };

  const saveEdit = async (serviceKey) => {
    try {
      const res = await fetch("/api/admin/pricing", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({
          serviceKey,
          priceUsd: parseFloat(editValues.priceUsd),
          label: editValues.label,
        }),
      });
      const data = await res.json();
      if (data.success) {
        addToast({ variant: "success", message: "Pricing updated!" });
        cancelEdit();
        loadPricing();
      } else {
        addToast({ variant: "error", message: data.message || "Update failed" });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Failed to update" });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 px-6 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-3">
          <MoneyBag02Icon className="text-accent" variant="solid" size={28} />
          Service Pricing
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Set the USD price for each premium service. BNB conversion is calculated automatically using live market data.
        </p>
      </div>

      <div className="space-y-4">
        {configs.map((config) => {
          const isEditing = editingKey === config.serviceKey;

          return (
            <div key={config.serviceKey} className="bg-surface-primary border border-border-primary rounded-xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {isEditing ? (
                      <Input
                        value={editValues.label}
                        onChange={(e) => setEditValues(prev => ({ ...prev, label: e.target.value }))}
                        className="max-w-xs"
                      />
                    ) : (
                      <h3 className="font-bold text-text-primary text-lg">{config.label}</h3>
                    )}
                    <Badge variant={config.active ? "success" : "neutral"} size="sm">
                      {config.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary font-mono">Key: {config.serviceKey}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">$</span>
                        <Input
                          type="number"
                          step="0.01"
                          value={editValues.priceUsd}
                          onChange={(e) => setEditValues(prev => ({ ...prev, priceUsd: e.target.value }))}
                          className="w-24"
                        />
                        <span className="text-sm text-text-secondary">USD</span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xl font-extrabold text-accent">${config.priceUsd?.toFixed(2)}</p>
                        <p className="text-xs text-text-tertiary">≈ {config.priceBnb?.toFixed(4)} BNB</p>
                      </>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => saveEdit(config.serviceKey)}>Save</Button>
                      <Button variant="secondary" size="sm" onClick={cancelEdit}>Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={() => startEdit(config)}>Edit</Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {configs.length === 0 && (
          <div className="bg-surface-primary border border-border-primary rounded-xl p-12 text-center">
            <p className="text-text-secondary">No pricing configs found. They'll be auto-seeded when a user first visits the pricing page.</p>
          </div>
        )}
      </div>
    </div>
  );
}
