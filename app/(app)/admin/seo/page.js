"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Skeleton from "@/components/ui/Skeleton";
import { useToast } from "@/components/ui/Toast";

export default function SeoPage() {
  const { address } = useWallet();
  const { addToast } = useToast();
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!address) return;

    const load = async () => {
      try {
        const res = await fetch("/api/admin/seo", {
          headers: { "x-wallet-address": address },
        });
        const data = await res.json();
        if (data.success) setSettings(data.settings);
      } catch (err) {
        console.error("Failed to load SEO settings:", err);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [address]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-wallet-address": address },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
        addToast({ variant: "success", message: "SEO settings saved successfully." });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Failed to save SEO settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const updatePageField = (page, field, value) => {
    setSettings(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [page]: { ...prev.pages[page], [field]: value },
      },
    }));
  };

  if (isLoading) {
    return (
      <div className="py-12 px-4 sm:px-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="py-12 px-4 sm:px-6 text-center">
        <p className="text-text-secondary">Failed to load SEO settings.</p>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl title text-text-primary">SEO Settings</h1>
          <p className="text-sm text-text-secondary mt-1">
            Manage global SEO metadata and per-page settings.
          </p>
        </div>
        <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
          Save Changes
        </Button>
      </div>

      {/* Global Settings */}
      <div className="bg-surface-primary card border border-border-primary rounded-xl p-6 mb-8 space-y-5">
        <h2 className="title text-text-primary text-sm">Global Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Site Title</label>
            <Input
              value={settings.siteTitle || ""}
              onChange={(e) => updateField("siteTitle", e.target.value)}
              placeholder="Teron — Launch Your Token on BNB Chain"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Canonical URL</label>
            <Input
              value={settings.canonicalUrl || ""}
              onChange={(e) => updateField("canonicalUrl", e.target.value)}
              placeholder="https://teron.io"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Site Description</label>
          <textarea
            value={settings.siteDescription || ""}
            onChange={(e) => updateField("siteDescription", e.target.value)}
            rows={3}
            className="w-full bg-surface-secondary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
            placeholder="Create, deploy, and verify your BEP-20 token..."
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Keywords</label>
          <textarea
            value={settings.siteKeywords || ""}
            onChange={(e) => updateField("siteKeywords", e.target.value)}
            rows={2}
            className="w-full bg-surface-secondary border border-border-primary rounded-lg px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent/40 resize-none"
            placeholder="BNB Chain, BEP-20, token creator..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">OG Image Path</label>
            <Input
              value={settings.ogImage || ""}
              onChange={(e) => updateField("ogImage", e.target.value)}
              placeholder="/og-image.png"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Twitter Handle</label>
            <Input
              value={settings.twitterHandle || ""}
              onChange={(e) => updateField("twitterHandle", e.target.value)}
              placeholder="@taborol"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={settings.robotsIndex !== false}
              onChange={(e) => updateField("robotsIndex", e.target.checked)}
              className="w-4 h-4 rounded accent-accent"
            />
            Index (robots)
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={settings.robotsFollow !== false}
              onChange={(e) => updateField("robotsFollow", e.target.checked)}
              className="w-4 h-4 rounded accent-accent"
            />
            Follow (robots)
          </label>
        </div>
      </div>

      {/* Per-Page Settings */}
      <div className="bg-surface-primary card border border-border-primary rounded-xl p-6 space-y-6">
        <h2 className="title text-text-primary text-sm">Per-Page SEO</h2>
        
        {Object.entries(settings.pages || {}).map(([page, pageSettings]) => (
          <div key={page} className="border-t border-border-primary pt-5 first:border-0 first:pt-0">
            <p className="text-xs font-bold uppercase text-text-tertiary tracking-wider mb-3">/{page === "home" ? "" : page}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Title</label>
                <Input
                  value={pageSettings.title || ""}
                  onChange={(e) => updatePageField(page, "title", e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-text-secondary block mb-1.5">Description</label>
                <Input
                  value={pageSettings.description || ""}
                  onChange={(e) => updatePageField(page, "description", e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
