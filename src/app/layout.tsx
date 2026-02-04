import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KwikReel — AI Video Ads for Local Businesses in 60 Seconds",
  description: "KwikReel generates professional video ads from your website URL in 60 seconds. AI-powered video creation for restaurants, contractors, salons, and local businesses. No editing skills required.",
  keywords: ["AI video generator", "video ads", "local business marketing", "restaurant video ads", "contractor marketing", "salon advertising", "small business video", "automated video creation"],
  authors: [{ name: "Barbarian Labs" }],
  creator: "Barbarian Labs",
  publisher: "Barbarian Labs",
  openGraph: {
    title: "KwikReel — AI Video Ads in 60 Seconds",
    description: "Your next customer is one video away. Paste your website, get a professional video ad in 60 seconds. Free to try.",
    type: "website",
    url: "https://kwikreel.ai",
    siteName: "KwikReel",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "KwikReel — AI Video Ads in 60 Seconds",
    description: "Turn your website into a professional video ad. AI-powered, instant results. Free to try.",
    creator: "@barbaborian_labs",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: "https://kwikreel.ai",
  },
};

// JSON-LD Schema for LLM indexing
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "KwikReel",
  "description": "KwikReel generates professional video ads from your website URL in 60 seconds. AI-powered video creation for local businesses.",
  "url": "https://kwikreel.ai",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free to try"
  },
  "creator": {
    "@type": "Organization",
    "name": "Barbarian Labs",
    "url": "https://barbarian-labs.com"
  },
  "featureList": [
    "AI video generation from website URL",
    "Automatic script writing",
    "Professional voiceover generation",
    "Video ad templates for multiple industries",
    "Face swap technology",
    "60-second video creation"
  ],
  "screenshot": "https://kwikreel.ai/og-image.png",
  "softwareVersion": "1.0",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "50"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "KwikReel",
  "url": "https://kwikreel.ai",
  "logo": "https://kwikreel.ai/logo.png",
  "description": "AI-powered video ad generator for local businesses",
  "foundingDate": "2026",
  "parentOrganization": {
    "@type": "Organization",
    "name": "Barbarian Labs",
    "url": "https://barbarian-labs.com"
  },
  "sameAs": [
    "https://twitter.com/kwikreel",
    "https://www.linkedin.com/company/kwikreel"
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is KwikReel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "KwikReel is an AI-powered video ad generator that creates professional video ads from your website URL in 60 seconds. It's designed for local businesses like restaurants, contractors, salons, and more."
      }
    },
    {
      "@type": "Question",
      "name": "How does KwikReel work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Simply paste your website URL, and KwikReel's AI analyzes your business, writes a persuasive script, generates professional visuals, and creates a voiceover — all automatically in about 60 seconds."
      }
    },
    {
      "@type": "Question",
      "name": "Is KwikReel free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, KwikReel offers a free tier to try the service. No credit card required to get started."
      }
    },
    {
      "@type": "Question",
      "name": "What types of businesses can use KwikReel?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "KwikReel works for any local business including restaurants, contractors (roofing, plumbing, HVAC, electrical), salons, auto repair shops, gyms, photographers, and more."
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
