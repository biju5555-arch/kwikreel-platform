import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KwikReel — Video Ads for Contractors in 60 Seconds",
  description: "Turn your website into a professional video ad in 60 seconds. AI-powered video generation for contractors, roofers, painters, plumbers, and more.",
  keywords: ["video ads", "contractor marketing", "AI video generator", "roofing ads", "plumber marketing", "construction advertising"],
  openGraph: {
    title: "KwikReel — Video Ads for Contractors",
    description: "Your next customer is one video away. Paste your website, get a video ad in 60 seconds.",
    type: "website",
    url: "https://kwikreel.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "KwikReel — Video Ads in 60 Seconds",
    description: "Turn your website into a professional video ad. AI-powered, instant results.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
