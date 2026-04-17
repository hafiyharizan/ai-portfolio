import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
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
  title: "Hafiy Harizan — Software & Data Engineer | Perth, Australia",
  description:
    "Perth-based software engineer and data & analytics engineer with 4+ years of experience across full stack development, data engineering, analytics platforms, automation, and AI-enabled solutions.",
  keywords: [
    "Hafiy Harizan",
    "Software Engineer",
    "Data Engineer",
    "AI Engineer",
    "Full Stack Developer",
    "Perth",
    "Australia",
    "Python",
    "React",
    "Next.js",
    "Data Analytics",
    "Azure AI",
  ],
  authors: [{ name: "Hafiy Harizan" }],
  creator: "Hafiy Harizan",
  openGraph: {
    type: "website",
    locale: "en_AU",
    title: "Hafiy Harizan — Software & Data Engineer",
    description:
      "Building scalable data platforms and intelligent applications. 4+ years across full stack, data engineering, analytics, and AI.",
    siteName: "Hafiy Harizan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hafiy Harizan — Software & Data Engineer",
    description:
      "Building scalable data platforms and intelligent applications. 4+ years across full stack, data engineering, analytics, and AI.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="grain min-h-screen bg-background text-foreground antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
