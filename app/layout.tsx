import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { jsonLd } from "@/lib/jsonld";
import CommandPalette from "@/components/CommandPalette";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  verification: { google: "42jWGrZFkr7LCa8ZL_G3-bRhJ5conGlHnLX_EuVk4S0" },
};

export const viewport: Viewport = { themeColor: "#1a1b26", colorScheme: "dark" };

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  email: site.email,
  jobTitle: "Software Engineer",
  alumniOf: { "@type": "CollegeOrUniversity", name: "University of Toronto" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
  sameAs: site.socials.filter((s) => !s.href.startsWith("mailto:")).map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
        {/* Mounted once, beside the page rather than inside it: the palette is chrome that
            overlays whatever route is rendered, and it draws nothing until it is opened. */}
        <CommandPalette />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd) }}
        />
      </body>
    </html>
  );
}
