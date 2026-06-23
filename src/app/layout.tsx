// Root layout: global chrome (nav, footer, bottom nav) + metadata.
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "Apostolic Power Network",
  description:
    "Discover Apostolic events, preaching, podcasts, prayer support, Bible study materials, and trusted resources — all in one place.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "Apostolic Power Network",
    description: "The Apostolic Community, All in One Place.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
