/**
 * SEO Service
 *
 * Owns: Dynamic metadata generation, Open Graph/Twitter card data, sitemap/robots generation.
 */

export function generateOGImageUrl({ title, desc, route }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teron.io";
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (desc) params.set("desc", desc);
  if (route) params.set("route", route);

  return `${baseUrl}/api/og?${params.toString()}`;
}

export function generateTokenMetadata(token) {
  const title = `${token.name} (${token.symbol}) | Teron Token`;
  const description = `View ${token.name} smart contract, statistics, and launch details on Teron.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: generateOGImageUrl({
            title: `${token.name} (${token.symbol})`,
            desc: description,
            route: `/token/${token.address}`,
          }),
          width: 1200,
          height: 630,
          alt: `${token.name} Token`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [
        generateOGImageUrl({
          title: `${token.name} (${token.symbol})`,
          desc: description,
          route: `/token/${token.address}`,
        }),
      ],
    },
  };
}

// Sitemap generation is handled by app/sitemap.js (Next.js built-in)
// Robots.txt is handled by app/robots.js (Next.js built-in)
// Manifest is handled by app/manifest.js (Next.js built-in)
