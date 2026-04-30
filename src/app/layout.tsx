import type { Metadata } from "next";
import Script from "next/script";
import { Geist, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Atmosphere } from "@/components/atmosphere";
import {
  APPEARANCE_MODES,
  APPEARANCE_STORAGE_KEY,
  DEFAULT_APPEARANCE_MODE,
  DEFAULT_THEME,
  THEME_NAMES,
  THEME_STORAGE_KEY,
  type AppearanceMode,
} from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jbMono = JetBrains_Mono({
  variable: "--font-jb-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Hafiy Harizan — Software Engineer",
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
  robots: { index: true, follow: true },
};

const themeInitScript = `(() => {
  try {
    const themes = ${JSON.stringify(THEME_NAMES)};
    const appearanceModes = ${JSON.stringify(APPEARANCE_MODES)};
    const stored = window.localStorage.getItem("${THEME_STORAGE_KEY}");
    const storedAppearance = window.localStorage.getItem("${APPEARANCE_STORAGE_KEY}");
    const appearanceMode = storedAppearance && appearanceModes.includes(storedAppearance)
      ? storedAppearance
      : "${DEFAULT_APPEARANCE_MODE}";
    const resolvedAppearance = appearanceMode === "auto"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : appearanceMode;
    document.documentElement.dataset.appearanceMode = appearanceMode;
    document.documentElement.dataset.appearance = resolvedAppearance;
    document.documentElement.style.colorScheme = resolvedAppearance;
    if (stored && stored.startsWith("custom:")) {
      const hue = parseFloat(stored.slice(7));
      if (!isNaN(hue)) {
        const r = document.documentElement;
        const hh = (hue + 15) % 360;
        r.dataset.theme = "custom";
        r.style.setProperty("--accent",       "oklch(0.72 0.18 " + hue + ")");
        r.style.setProperty("--accent-light", "oklch(0.78 0.16 " + hue + ")");
        r.style.setProperty("--accent-hot",   "oklch(0.76 0.22 " + hh + ")");
        r.style.setProperty("--accent-soft",  "oklch(0.72 0.18 " + hue + " / 0.16)");
        r.style.setProperty("--accent-line",  "oklch(0.72 0.18 " + hue + " / 0.42)");
        r.style.setProperty("--accent-glow",  "oklch(0.72 0.18 " + hue + " / 0.16)");
        r.style.setProperty("--accent-ink",   "oklch(0.1 0.04 " + hue + ")");
      }
    } else {
      const theme = stored && themes.includes(stored) ? stored : "${DEFAULT_THEME}";
      document.documentElement.dataset.theme = theme;
    }
  } catch {
    document.documentElement.dataset.theme = "${DEFAULT_THEME}";
    document.documentElement.dataset.appearanceMode = "${DEFAULT_APPEARANCE_MODE}";
  }
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${jbMono.variable}`}
      data-theme={DEFAULT_THEME}
      data-appearance-mode={DEFAULT_APPEARANCE_MODE}
      data-appearance={(DEFAULT_APPEARANCE_MODE as AppearanceMode) === "auto" ? undefined : DEFAULT_APPEARANCE_MODE}
      suppressHydrationWarning
    >
      <body className="grain min-h-screen bg-background text-foreground antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <Atmosphere />
        <Navbar />
        <main className="relative z-[2] pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
