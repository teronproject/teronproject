import React from "react";

const routes = [
  {
    path: "/",
    title: "Premium Web3 Token Launch Platform",
    desc: "Create, deploy, and manage BEP-20 tokens on BNB Chain with a premium launch experience.",
  },
  {
    path: "/pricing",
    title: "Transparent Pricing for Premium Launches",
    desc: "Launch your BEP-20 token with zero hidden fees. Experience the most advanced token creator on BNB Chain.",
  },
  {
    path: "/leaderboard",
    title: "Top Performing Tokens",
    desc: "Discover the most successful BEP-20 tokens launched and managed through the Teron platform.",
  },
  {
    path: "/about",
    title: "The Teron Vision",
    desc: "We are building the standard for safe, transparent, and premium token launches on the BNB Chain.",
  },
];

export const metadata = {
  title: "OG Image Gallery",
  description: "Preview Open Graph images for all public routes.",
};

export default function OGGalleryPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto">
      <div className="mb-16">
        <h1 className="text-3xl title sm:text-4xl font-bold tracking-tight text-white mb-6">
          Open Graph Gallery
        </h1>
        <p className="text-md text-text-secondary max-w-2xl">
          Visual preview of dynamically generated social sharing images for public routes. These images are generated at the edge using Next.js ImageResponse.
        </p>
      </div>

      <div className="space-y-24">
        {routes.map((route) => {
          const params = new URLSearchParams({
            title: route.title,
            desc: route.desc,
          });
          const ogUrl = `/api/og?${params.toString()}`;

          return (
            <div key={route.path} className="flex flex-col gap-6">
              <div className="flex items-center justify-between border-b border-border-primary border-dashed pb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white mb-1">
                    {route.path}
                  </h2>
                  {/* <p className="text-sm text-text-tertiary font-mono">
                    {ogUrl}
                  </p> */}
                </div>
                <a
                  href={ogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm cta text-accent hover:text-accent-hover transition-colors font-medium flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg"
                >
                  View Full Size
                </a>
              </div>
              <div className="relative rounded-[24px] overflow-hidden border border-border-primary/50 bg-bg-secondary aspect-[1200/630] shadow-2xl ring-1 ring-white/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ogUrl}
                  alt={`OG Preview for ${route.path}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
