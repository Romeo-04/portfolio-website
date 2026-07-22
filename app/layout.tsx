import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jhezra A. Tolentino — Software Engineer",
  description:
    "Software Engineer specializing in Web Development, Machine Learning, and Full-Stack Projects. FEU Tech Computer Science student with strong academic and leadership credentials.",
  keywords: [
    "Jhezra Tolentino",
    "Software Engineer",
    "Web Developer",
    "Machine Learning",
    "Full-Stack",
    "FEU Tech",
    "Portfolio",
  ],
  authors: [{ name: "Jhezra A. Tolentino" }],
  openGraph: {
    title: "Jhezra A. Tolentino — Software Engineer",
    description:
      "Software Engineer building thoughtful systems across web development, machine learning, and interactive experiences.",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jhezra A. Tolentino — Software Engineer",
    description:
      "Software Engineer building thoughtful systems across web development, machine learning, and interactive experiences.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${dmSans.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
