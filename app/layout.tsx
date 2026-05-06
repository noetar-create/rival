import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/MobileNav";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#8B5CF6",
};

export const metadata: Metadata = {
  title: {
    default: "Rival — Compete. Win. Repeat.",
    template: "%s | Rival",
  },
  description:
    "Rival is the competitive social platform where you post videos, play daily games, and battle for the weekly leaderboard. Win prizes every week.",
  keywords: ["rival", "competitive social media", "video competition", "daily games", "leaderboard", "win prizes"],
  metadataBase: new URL("https://rivalapp.io"),
  openGraph: {
    type: "website",
    siteName: "Rival",
    title: "Rival — Compete. Win. Repeat.",
    description:
      "The competitive social platform. Post videos, play daily mini-games, and climb the weekly leaderboard to win prizes.",
    url: "https://rivalapp.io",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rival App" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rival — Compete. Win. Repeat.",
    description:
      "The competitive social platform. Post videos, play daily mini-games, and climb the weekly leaderboard to win prizes.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6062430197771235"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full bg-[#0a0a0a] text-white antialiased">
        {/* Desktop sidebar */}
        <Navbar />

        {/* Main content */}
        <main className="md:ml-64 min-h-screen pb-20 md:pb-0">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <MobileNav />
      </body>
    </html>
  );
}
