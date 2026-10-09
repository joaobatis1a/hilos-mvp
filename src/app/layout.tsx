import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { siteConfig } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: "HILOS — Fios que vestem seus passos",
  description:
    "Peças leves, autênticas e feitas para acompanhar cada movimento. Conheça a coleção HILOS.",
  openGraph: {
    title: "HILOS — Fios que vestem seus passos",
    description:
      "Peças leves, autênticas e feitas para acompanhar cada movimento. Conheça a coleção HILOS.",
    url: siteConfig.siteUrl,
    siteName: "HILOS",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HILOS — Fios que vestem seus passos",
    description:
      "Peças leves, autênticas e feitas para acompanhar cada movimento.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "HILOS",
    url: siteConfig.siteUrl,
    slogan: siteConfig.tagline,
    address: {
      "@type": "PostalAddress",
      addressRegion: "PE",
      addressCountry: "BR",
    },
  };

  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
