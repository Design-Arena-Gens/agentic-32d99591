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
  title: "Higher-Ed Education Agent",
  description:
    "A human-centred education agent that transforms complex academic challenges into structured, actionable plans.",
  openGraph: {
    title: "Higher-Ed Education Agent",
    description:
      "A human-centred education agent that transforms complex academic challenges into structured, actionable plans.",
    url: "https://agentic-32d99591.vercel.app",
    siteName: "Agentic Learning Studio",
  },
  metadataBase: new URL("https://agentic-32d99591.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
