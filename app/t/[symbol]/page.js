import TokenProfileClient from "@/components/token/TokenProfileClient";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teron.io";
  
  let tokenData = null;
  try {
    const res = await fetch(`${baseUrl}/api/projects/${symbol}`, {
      next: { revalidate: 60 } // cache for 60 seconds
    });
    if (res.ok) {
      const data = await res.json();
      tokenData = data.token;
    }
  } catch (err) {
    console.error("Failed to fetch token for metadata:", err);
  }

  const name = tokenData?.name || "Unknown Token";
  const desc = tokenData?.profile?.shortDescription || `View the smart contract profile for ${name} on Teron.`;

  return {
    title: `${name} (${symbol.toUpperCase()}) | Teron Profile`,
    description: desc,
    openGraph: {
      title: `${name} (${symbol.toUpperCase()}) | Teron Profile`,
      description: desc,
      url: `${baseUrl}/t/${symbol}`,
      siteName: "Teron",
      images: [
        {
          url: `${baseUrl}/t/${symbol}/opengraph-image`,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} (${symbol.toUpperCase()}) | Teron Profile`,
      description: desc,
      images: [`${baseUrl}/t/${symbol}/opengraph-image`],
    },
  };
}

export default async function TokenProfilePage({ params }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://teron.io";
  
  let initialToken = null;
  let initialError = null;

  try {
    const res = await fetch(`${baseUrl}/api/projects/${symbol}`, {
      next: { revalidate: 60 }
    });
    const data = await res.json();
    
    if (res.ok && data.token) {
      initialToken = data.token;
    } else {
      initialError = data.message || "Token not found";
    }
  } catch (err) {
    initialError = "Failed to fetch token profile.";
  }

  return (
    <TokenProfileClient 
      symbolOrAddr={symbol} 
      initialToken={initialToken} 
      initialError={initialError} 
    />
  );
}
