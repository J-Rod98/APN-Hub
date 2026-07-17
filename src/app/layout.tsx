// Root layout: global chrome (nav, footer, bottom nav) + metadata.
import type { Metadata, Viewport } from "next";
import { Newsreader, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

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
  title: "Apostolic Power Network",
  description:
    "Discover Apostolic sermons, podcasts, events, and trusted resources — all in one place.",
  openGraph: {
    title: "Apostolic Power Network",
    description: "The Apostolic Community, All in One Place.",
    type: "website",
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
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
