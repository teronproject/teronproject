"use client";

import { useEffect, useState, useRef } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useToastContext } from "@/components/ToastProvider";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

export default function SettingsPage() {
  const {
    address,
    isConnected,
    userProfile,
    refreshProfile,
    chain,
  } = useWallet();
  const { addToast } = useToastContext();

  const [form, setForm] = useState({
    displayName: "",
    email: "",
    website: "",
    twitter: "",
    telegram: "",
    discord: "",
    github: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState(null);

  // Cloudinary avatar upload
  const {
    upload: uploadAvatar,
    isUploading: isAvatarUploading,
    progress: avatarProgress,
  } = useCloudinaryUpload({ type: "avatar", walletAddress: address });

  const fileInputRef = useRef(null);

  // Load full profile on mount
  useEffect(() => {
    if (!address) return;

    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/profile", {
          headers: { "x-wallet-address": address },
        });
        const data = await res.json();
        if (res.ok && data.user) {
          setForm({
            displayName: data.user.displayName || "",
            email: data.user.email || "",
            website: data.user.website || "",
            twitter: data.user.twitter || "",
            telegram: data.user.telegram || "",
            discord: data.user.discord || "",
            github: data.user.github || "",
          });
          setAvatarUrl(data.user.avatar || null);
        }
      } catch (err) {
        addToast({ variant: "error", message: "Failed to load profile" });
      } finally {
        setIsLoadingProfile(false);
      }
    }

    loadProfile();
  }, [address]);

  const handleInputChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 2 * 1024 * 1024) {
      addToast({ variant: "error", message: "Avatar must be under 2MB" });
      return;
    }

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      addToast({
        variant: "error",
        message: "Avatar must be JPG, PNG, or WebP",
      });
      return;
    }

    const url = await uploadAvatar(file);
    if (url) {
      setAvatarUrl(url);
      // Save avatar URL immediately
      await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify({ avatar: url }),
      });
      await refreshProfile();
      addToast({ variant: "success", message: "Avatar uploaded!" });
    } else {
      addToast({ variant: "error", message: "Avatar upload failed" });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-wallet-address": address,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        await refreshProfile();
        addToast({ variant: "success", message: "Profile updated!" });
      } else {
        const data = await res.json();
        addToast({
          variant: "error",
          message: data.message || "Failed to update profile",
        });
      }
    } catch (err) {
      addToast({ variant: "error", message: "Network error" });
    } finally {
      setIsSaving(false);
    }
  };

  // Not connected
  if (!isConnected) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="text-5xl opacity-30">🔒</div>
        <h1 className="text-2xl font-bold text-text-primary">
          Connect Wallet to Access Settings
        </h1>
        <p className="text-text-secondary text-sm max-w-md mx-auto">
          You need to connect your BNB Chain wallet to view and edit your
          profile.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-text-primary">
          Profile Settings
        </h1>
        <p className="text-text-secondary text-sm">
          Manage your public profile, contact information, and social links.
        </p>
      </div>

      {/* Avatar & Identity Card */}
      <Card>
        <Card.Header>
          <h2 className="text-sm font-bold text-text-primary">
            Wallet Identity
          </h2>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-2 border-border-secondary bg-surface-primary overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-accent font-mono">
                    {address?.slice(2, 4).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Upload overlay */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAvatarUploading}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold"
              >
                {isAvatarUploading ? `${avatarProgress}%` : "Upload"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <Badge variant="accent" size="sm">
                  BNB Chain
                </Badge>
                <Badge variant="neutral" size="sm">
                  Chain ID: {chain?.id || "—"}
                </Badge>
                {userProfile?.role === "ADMIN" && (
                  <Badge variant="success" size="sm">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="font-mono text-sm text-text-secondary break-all">
                {address}
              </p>
              <p className="text-xs text-text-tertiary">
                Your wallet address is your unique identity on Teron. It cannot
                be changed.
              </p>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Profile Details Form */}
      <Card>
        <Card.Header>
          <h2 className="text-sm font-bold text-text-primary">
            Public Profile
          </h2>
        </Card.Header>
        <Card.Body className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Display Name"
              placeholder="Your name or alias"
              value={form.displayName}
              onChange={handleInputChange("displayName")}
              helperText="Shown publicly on your token profiles and the leaderboard."
              maxLength={50}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleInputChange("email")}
              helperText="Used for deployment notifications. Never displayed publicly."
            />
          </div>
        </Card.Body>
      </Card>

      {/* Social Links */}
      <Card>
        <Card.Header>
          <h2 className="text-sm font-bold text-text-primary">Social Links</h2>
        </Card.Header>
        <Card.Body className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Website"
              type="url"
              placeholder="https://yoursite.com"
              value={form.website}
              onChange={handleInputChange("website")}
            />
            <Input
              label="Twitter / X"
              placeholder="@yourhandle"
              value={form.twitter}
              onChange={handleInputChange("twitter")}
            />
            <Input
              label="Telegram"
              placeholder="t.me/yourgroup"
              value={form.telegram}
              onChange={handleInputChange("telegram")}
            />
            <Input
              label="Discord"
              placeholder="discord.gg/invite"
              value={form.discord}
              onChange={handleInputChange("discord")}
            />
            <Input
              label="GitHub"
              placeholder="github.com/yourname"
              value={form.github}
              onChange={handleInputChange("github")}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-4 pt-4 border-t border-border-primary">
        <Link
          href="/dashboard"
          className="h-10 px-5 bg-surface-primary border border-border-secondary text-text-primary font-semibold rounded inline-flex items-center text-sm hover:bg-surface-secondary transition-colors"
        >
          Go to Dashboard
        </Link>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
