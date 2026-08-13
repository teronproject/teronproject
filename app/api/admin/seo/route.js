import { NextResponse } from "next/server";
import { isAdmin } from "@/services/auth";
import fs from "fs";
import path from "path";

// SEO settings stored in a JSON file since they're global config, not per-entity
const SEO_FILE = path.join(process.cwd(), "seo-settings.json");

const DEFAULT_SEO = {
  siteTitle: "Teron — Launch Your Token on BNB Chain",
  siteDescription: "Create, deploy, and verify your BEP-20 token on BNB Smart Chain in minutes. No coding required. Teron handles smart contract deployment and BscScan verification.",
  siteKeywords: "BNB Chain, BEP-20, token creator, token launch, smart contract, BscScan verification, crypto project, launch platform",
  ogImage: "/og-image.png",
  twitterHandle: "@taborol",
  robotsIndex: true,
  robotsFollow: true,
  canonicalUrl: "https://teron.io",
  pages: {
    home: { title: "Teron — Launch Your Token on BNB Chain", description: "Create and deploy your BEP-20 token on BNB Smart Chain. No coding required." },
    about: { title: "About Teron — BNB Chain Token Launch Platform", description: "Learn about Teron, the simplest way to create and deploy tokens on BNB Smart Chain." },
    pricing: { title: "Pricing — Teron Token Launch Platform", description: "Transparent pricing for token deployment, contract verification, and on-chain metadata on BNB Chain." },
    leaderboard: { title: "Token Leaderboard — Teron", description: "Discover the latest tokens launched on BNB Chain through the Teron platform." },
  },
};

function readSeoSettings() {
  try {
    if (fs.existsSync(SEO_FILE)) {
      return JSON.parse(fs.readFileSync(SEO_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Error reading SEO settings:", e);
  }
  return DEFAULT_SEO;
}

function writeSeoSettings(settings) {
  fs.writeFileSync(SEO_FILE, JSON.stringify(settings, null, 2), "utf8");
}

export async function GET(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const settings = readSeoSettings();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("SEO GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const walletAddress = request.headers.get("x-wallet-address");
    if (!walletAddress || !(await isAdmin(walletAddress))) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updates = await request.json();
    const current = readSeoSettings();
    const merged = { ...current, ...updates };

    // Deep merge pages if provided
    if (updates.pages) {
      merged.pages = { ...current.pages, ...updates.pages };
    }

    writeSeoSettings(merged);
    return NextResponse.json({ success: true, settings: merged });
  } catch (error) {
    console.error("SEO PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
