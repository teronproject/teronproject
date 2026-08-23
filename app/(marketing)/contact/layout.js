import { generateOGImageUrl } from "@/services/seo";

export const metadata = {
  title: "Contact Teron | Support & Inquiries",
  description: "Get in touch with the Teron team for technical support, partnership inquiries, or media requests. We typically respond within 24–48 hours.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Teron | Support & Inquiries",
    description: "Get in touch with the Teron team for technical support, partnership inquiries, or media requests.",
    url: "/contact",
    images: [
      {
        url: generateOGImageUrl({
          title: "Contact Teron",
          desc: "Get in touch with the Teron team for support and partnership inquiries.",
          route: "/contact",
        }),
        width: 1200,
        height: 630,
        alt: "Contact Teron",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Teron | Support & Inquiries",
    description: "Get in touch with the Teron team for technical support, partnership inquiries, or media requests.",
  },
};

export default function ContactLayout({ children }) {
  return children;
}
