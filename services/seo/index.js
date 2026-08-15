/**
 * SEO Service
 *
 * Owns: Dynamic metadata generation, Open Graph/Twitter card data, sitemap/robots generation.
 */

export function generateOGImageUrl({ title, desc, label }) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teron.io";
  const params = new URLSearchParams();
  if (title) params.set("title", title);
  if (desc) params.set("desc", desc);
  if (label) params.set("label", label);

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
            label: "Teron Token",
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
          label: "Teron Token",
        }),
      ],
    },
  };
}

export async function generateSitemap() {
  throw new Error("Not implemented");
}
