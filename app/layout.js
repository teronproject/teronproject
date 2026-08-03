import { Inter, JetBrains_Mono } from "next/font/google";
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
  },
  twitter: {
    card: "summary_large_image",
    title: "Teron — Premium Web3 Token Launch Platform",
    description:
      "Create, deploy, and manage BEP-20 tokens on BNB Chain with a premium launch experience.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-dvh flex flex-col">{children}</body>
    </html>
  );
}
