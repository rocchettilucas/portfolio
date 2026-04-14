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

export const metadata: Metadata = {
  title: "Lucas Rocchetti | Software Engineer",
  description:
    "Portfolio of Lucas Rocchetti — Computer Science graduate from the University of Toronto. Full-stack developer specializing in React, TypeScript, and cloud-native applications.",
  keywords: [
    "Lucas Rocchetti",
    "Software Engineer",
    "Full Stack Developer",
    "React",
    "TypeScript",
    "University of Toronto",
    "Portfolio",
  ],
  openGraph: {
    title: "Lucas Rocchetti | Software Engineer",
    description:
      "Computer Science graduate from UofT. Building full-stack applications with React, TypeScript, and modern cloud platforms.",
    type: "website",
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
