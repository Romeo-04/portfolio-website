import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Applied before first paint so a light-theme visitor never sees a flash of
// the dark default. Kept tiny and dependency-free on purpose.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.add("light")}}catch(e){}})();`;

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
