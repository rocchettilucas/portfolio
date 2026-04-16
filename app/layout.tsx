import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://lucasrocchetti.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Lucas Rocchetti | Software Engineer",
  description:
    "Lucas Rocchetti — Computer Science graduate from the University of Toronto. Full-stack developer specializing in React, TypeScript, and cloud-native applications.",
  keywords: [
    "Lucas Rocchetti",
    "lucas rocchetti",
    "Lucas Rocchetti portfolio",
    "Lucas Rocchetti software engineer",
    "Software Engineer",
    "Full Stack Developer",
    "React Developer",
    "TypeScript",
    "University of Toronto Computer Science",
    "Toronto Software Engineer",
  ],
  authors: [{ name: "Lucas Rocchetti", url: siteUrl }],
  creator: "Lucas Rocchetti",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Lucas Rocchetti | Software Engineer",
    description:
      "Lucas Rocchetti — Computer Science graduate from UofT. Building full-stack applications with React, TypeScript, and modern cloud platforms.",
    url: siteUrl,
    siteName: "Lucas Rocchetti",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lucas Rocchetti | Software Engineer",
    description:
      "Computer Science graduate from UofT. Full-stack developer specializing in React, TypeScript, and cloud-native applications.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "42jWGrZFkr7LCa8ZL_G3-bRhJ5conGlHnLX_EuVk4S0",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Lucas Rocchetti",
  url: siteUrl,
  jobTitle: "Software Engineer",
  description:
    "Computer Science graduate from the University of Toronto. Full-stack developer specializing in React, TypeScript, and cloud-native applications.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Toronto",
  },
  knowsAbout: [
    "React",
    "TypeScript",
    "Python",
    "Node.js",
    "Full-Stack Development",
    "Cloud Computing",
  ],
  sameAs: [
    "https://linkedin.com/in/lucasrocchetti",
    "https://github.com/rocchettilucas",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Toronto",
    addressRegion: "ON",
    addressCountry: "CA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
