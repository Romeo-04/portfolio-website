import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
