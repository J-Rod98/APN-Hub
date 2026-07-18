// Root layout: global chrome (nav, footer, bottom nav) + metadata.
import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { DEFAULT_SOCIAL_IMAGE, SITE_URL } from "@/lib/seo";

// Sanctuary Light type pairing: Newsreader (editorial headings) + Instrument
// Sans (body/UI). Exposed as CSS vars consumed by tailwind.config.ts.
const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
  // Next has no fallback metrics for Newsreader; skip the size-adjust step
  // rather than emit a build warning on every compile.
  adjustFontFallback: false,
});

const instrument = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Apostolic Power Network",
    template: "%s | Apostolic Power Network",
  },
  description:
    "Discover Apostolic sermons, podcasts, events, and trusted resources — all in one place.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Apostolic Power Network",
    description: "Discover trusted Apostolic sermons, podcasts, events, and resources in one place.",
    url: SITE_URL,
    type: "website",
    images: [{ url: DEFAULT_SOCIAL_IMAGE, alt: "Apostolic worship at a UPCI gathering." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apostolic Power Network",
    description: "Discover trusted Apostolic sermons, podcasts, events, and resources in one place.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#eef2fb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${newsreader.variable} ${instrument.variable}`}>
      <body>
        <Navbar />
        <main className="min-h-[60vh] pb-20 md:pb-0">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
