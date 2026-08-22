import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucas Rocchetti",
  verification: { google: "42jWGrZFkr7LCa8ZL_G3-bRhJ5conGlHnLX_EuVk4S0" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
