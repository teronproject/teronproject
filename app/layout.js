import { Inter, JetBrains_Mono } from "next/font/google";
import { generateOGImageUrl } from "@/services/seo";
import { OrganizationJsonLd, WebSiteJsonLd, WebApplicationJsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "Teron - Create & Deploy BEP-20 Tokens on BNB Chain",
    template: "%s | Teron",
  },
  description:
    "Create, deploy, and manage BEP-20 tokens on BNB Smart Chain. Free deployment with optional BscScan verification, on-chain metadata publishing, public token profiles, and gas assistance. The premium Web3 token launchpad.",
  keywords: [
    "Teron",
    "teron.io",
    "BNB Chain",
    "BNB token creator",
    "BEP-20 token",
    "BEP-20 token creator",
    "create token BNB",
    "deploy token BNB Chain",
    "token launch platform",
    "Web3 token launchpad",
    "crypto token creator",
    "smart contract deployment",
    "BscScan verification",
    "token generator",
    "create cryptocurrency",
    "BNB Smart Chain token",
    "token deployment",
    "no-code token creator",
    "DeFi token launch",
    "meme coin creator BNB",
  ],
  authors: [{ name: "Teron", url: "https://www.teron.io" }],
  creator: "Teron",
  publisher: "Teron",
  category: "Finance",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://www.teron.io"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Teron",
    title: "Teron - Create & Deploy BEP-20 Tokens on BNB Chain",
    description:
      "The premium Web3 token launchpad. Create, deploy, and manage BEP-20 tokens on BNB Smart Chain with free deployment, BscScan verification, and on-chain metadata.",
    images: [
      {
        url: generateOGImageUrl({
          title: "Web3 Token Launch Platform",
          desc: "Create, deploy, and manage BEP-20 tokens on BNB Chain with a launch experience.",
          route: "/",
        }),
        width: 1200,
        height: 630,
        alt: "Teron - Web3 Token Launch Platform on BNB Chain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@teronapp",
    creator: "@teronapp",
    title: "Teron - Create & Deploy BEP-20 Tokens on BNB Chain",
    description:
      "The premium Web3 token launchpad. Free deployment on BNB Smart Chain with BscScan verification and on-chain metadata.",
    images: [
      generateOGImageUrl({
        title: "Web3 Token Launch Platform",
        desc: "Create, deploy, and manage BEP-20 tokens on BNB Chain with a launch experience.",
        route: "/",
      }),
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "NZ86v8UOdj9FbVb_EqRdxamtjde92UdF077LwHDOOOY",
  },
  other: {
    "msapplication-TileColor": "#050403",
    "apple-mobile-web-app-title": "Teron",
  },
  icons: {
    icon: "/token.png",
    shortcut: "/token.png",
    apple: "/token.png",
  },
};

import { Providers } from "@/components/Providers";
import { GoogleAnalytics } from "@next/third-parties/google";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <OrganizationJsonLd />
        <WebSiteJsonLd />
        <WebApplicationJsonLd />
      </head>
      <body className="min-h-dvh flex flex-col max-w-[1500px] border border-l border-r border-border-primary w-full mx-auto ">
        <Providers>{children}</Providers>
      </body>
      <GoogleAnalytics gaId="G-YRK3LMJPTN" />
    </html>
  );
}
