/**
 * JSON-LD Structured Data Components
 *
 * Provides rich structured data for Google Search, AI chatbots, and knowledge panels.
 * Each function returns a <script type="application/ld+json"> tag.
 */

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Teron",
    alternateName: "Teron Protocol",
    url: "https://www.teron.io",
    logo: "https://www.teron.io/token.png",
    description:
      "Premium Web3 token launch platform for BNB Chain. Create, deploy, and manage BEP-20 tokens with smart contract verification and on-chain metadata.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@teron.io",
      contactType: "customer support",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://x.com/teronapp",
      "https://docs.teron.io/",
    ],
    foundingDate: "2025",
    knowsAbout: [
      "BNB Chain",
      "BEP-20 Tokens",
      "Smart Contracts",
      "Token Launch",
      "Web3",
      "Blockchain",
      "DeFi",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Teron",
    alternateName: "Teron Token Launchpad",
    url: "https://www.teron.io",
    description:
      "Premium Web3 token launch platform for creating and deploying BEP-20 tokens on BNB Smart Chain.",
    publisher: {
      "@type": "Organization",
      name: "Teron",
      logo: {
        "@type": "ImageObject",
        url: "https://www.teron.io/token.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.teron.io/leaderboard?search={search_term}",
      },
      "query-input": "required name=search_term",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebApplicationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Teron",
    url: "https://www.teron.io",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    description:
      "Create and deploy BEP-20 tokens on BNB Smart Chain in minutes. Free base deployment with optional premium BscScan verification and on-chain metadata.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free token deployment on BNB Smart Chain",
    },
    featureList: [
      "BEP-20 Token Creation",
      "Smart Contract Deployment",
      "BscScan Contract Verification",
      "On-Chain Metadata & Logo Publishing",
      "Public Token Profile Pages",
      "Community Leaderboard",
      "BNB Gas Assistance Program",
    ],
    screenshot: "https://www.teron.io/og.png",
    creator: {
      "@type": "Organization",
      name: "Teron",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function FAQJsonLd({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }) {
  if (!items || items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url ? `https://www.teron.io${item.url}` : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
