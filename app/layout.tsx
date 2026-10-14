import type { Metadata } from "next";
import { Courier_Prime, Kalam, Lilita_One, Varela_Round } from "next/font/google";
import "./globals.css";
import { personalInfo, siteConfig } from "@/data/portfolio";

const display = Lilita_One({ variable: "--font-lilita", subsets: ["latin"], weight: "400", display: "swap" });
const receipt = Courier_Prime({ variable: "--font-courier-prime", subsets: ["latin"], weight: ["400", "700"], display: "swap" });
const cafe = Varela_Round({ variable: "--font-varela", subsets: ["latin"], weight: "400", display: "swap" });
const board = Kalam({ variable: "--font-kalam", subsets: ["latin"], weight: "700", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: `${siteConfig.name} — ${siteConfig.title}`,
  description: siteConfig.description,
  keywords: [
    "Jhezra Tolentino",
    "Software Engineer",
    "Web Developer",
    "Machine Learning",
    "Full-Stack",
    "FEU Tech",
    "Portfolio",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  alternates: { canonical: "/" },
  verification: { google: "1HU0cnVBurlUNvIgIKWOAndNQBByDmemEXvj1nJxYxU" },
  // og:image / twitter:image come from app/opengraph-image.tsx.
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: personalInfo.tagline,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: personalInfo.tagline,
  },
};

// Person schema so search can tie the name, role, and profiles together.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personalInfo.name,
  jobTitle: personalInfo.role,
  url: siteConfig.url,
  image: new URL(personalInfo.heroImage, siteConfig.url).href,
  email: `mailto:${personalInfo.email}`,
  alumniOf: { "@type": "CollegeOrUniversity", name: personalInfo.school },
  sameAs: [personalInfo.github, personalInfo.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body
        className={`${display.variable} ${receipt.variable} ${cafe.variable} ${board.variable} font-cafe min-h-screen bg-[#1b120c] text-[#f5e9da]`}
      >
        {children}
      </body>
    </html>
  );
}
