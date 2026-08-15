import { Inter, JetBrains_Mono } from "next/font/google";
import { generateOGImageUrl } from "@/services/seo";
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
    default: "Teron — Premium Web3 Token Launch Platform",
    template: "%s | Teron",
  },
  description:
    "Create, deploy, and manage BEP-20 tokens on BNB Chain with a premium launch experience. Contract verification, metadata publishing, rewards, and more.",
  keywords: [
    "BNB Chain",
    "token launch",
    "BEP-20",
    "Web3",
    "crypto",
    "token creator",
    "smart contract",
    "Teron",
  ],
  authors: [{ name: "Teron" }],
  creator: "Teron",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://teron.io"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Teron",
    title: "Teron — Premium Web3 Token Launch Platform",
    description:
      "Create, deploy, and manage BEP-20 tokens on BNB Chain with a premium launch experience.",
    images: [
      {
        url: generateOGImageUrl({
          title: "Premium Web3 Token Launch Platform",
          desc: "Create, deploy, and manage BEP-20 tokens on BNB Chain with a premium launch experience.",
        }),
        width: 1200,
        height: 630,
        alt: "Teron Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teron — Premium Web3 Token Launch Platform",
    description:
      "Create, deploy, and manage BEP-20 tokens on BNB Chain with a premium launch experience.",
    images: [
      generateOGImageUrl({
        title: "Premium Web3 Token Launch Platform",
        desc: "Create, deploy, and manage BEP-20 tokens on BNB Chain with a premium launch experience.",
      }),
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

import { Providers } from "@/components/Providers";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh flex flex-col max-w-[1500px] border border-l border-r border-border-primary w-full mx-auto ">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
