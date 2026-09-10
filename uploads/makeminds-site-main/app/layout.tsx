import type { Metadata, Viewport } from "next";
import { DM_Sans, Space_Grotesk, Geist_Mono } from "next/font/google";
import BootLoader from "./_components/effects/BootLoader";
import TopHairline from "./_components/effects/TopHairline";
import PageTransition from "./_components/effects/PageTransition";
import KonamiTerminal from "./_components/effects/KonamiTerminal";
import ConsoleBanner from "./_components/effects/ConsoleBanner";
import DebugGrid from "./_components/effects/DebugGrid";
import LenisProvider from "./_components/effects/LenisProvider";
import Cursor from "./_components/effects/Cursor";
import MouseGlow from "./_components/effects/MouseGlow";
import TopNav from "./_components/nav/TopNav";
import PageEndNav from "./_components/nav/PageEndNav";
import Footer from "./_components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://makemindsrobotics.org"),
  title: {
    default: "MakEMinds Robotics · FTC 23786",
    template: "%s · MakEMinds Robotics",
  },
  description:
    "FTC Team 23786 — student-led robotics from Edison, NJ. Engineering notebook, season results, programs, and outreach.",
  openGraph: {
    title: "MakEMinds Robotics · FTC 23786",
    description:
      "Student-led FTC robotics from Edison, NJ. 27 events, 8 awards, building since 2023.",
    type: "website",
    url: "/",
    siteName: "MakEMinds Robotics",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MakEMinds Robotics · FTC 23786",
    description:
      "Student-led FTC robotics from Edison, NJ. 27 events, 8 awards, building since 2023.",
  },
  robots: { index: true, follow: true },
  authors: [{ name: "MakEMinds Robotics" }],
  category: "STEM education",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/notebook/feed.xml", title: "MakEMinds Robotics — Engineering Notebook" },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* View-source easter egg (PLAN §7). Recruiters welcome. */}
        <meta
          name="x-mm-banner"
          content="-- MakEMinds Robotics // FTC Team 23786 // Edison NJ // recruiting: info@makemindsrobotics.org --"
        />
        {/* Organization JSON-LD. Helps Google's Knowledge Graph attach our
            FIRST team profile to brand searches. Handles flagged as placeholder
            in BLOCKED.md item 4 until the user confirms. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsTeam",
              name: "MakEMinds Robotics",
              alternateName: "FTC 23786",
              url: "https://makemindsrobotics.org",
              logo: "https://makemindsrobotics.org/icon.png",
              description:
                "Student-led FIRST Tech Challenge robotics team from Edison, NJ. Team number 23786.",
              sport: "Robotics",
              memberOf: {
                "@type": "Organization",
                name: "FIRST Tech Challenge",
                url: "https://www.firstinspires.org/robotics/ftc",
              },
              location: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Edison",
                  addressRegion: "NJ",
                  addressCountry: "US",
                },
              },
              sameAs: [
                "https://instagram.com/makemindsrobotics",
                "https://youtube.com/@makemindsrobotics",
              ],
            }),
          }}
        />
      </head>
      <body className="bg-grain min-h-full flex flex-col">
        {/* No-JS fallback: skip the boot fade entirely so the page is
            visible even when scripts are disabled. */}
        <noscript>
          <style>{`[data-boot-fade]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {/* Skip link for keyboard users — visually hidden until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:border focus:border-accent focus:bg-bg focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.18em] focus:text-accent"
        >
          Skip to content
        </a>
        <TopHairline />
        <TopNav />
        <div
          id="main-content"
          data-boot-fade
          className="flex flex-1 flex-col pt-20"
        >
          {children}
          <PageEndNav />
          <Footer />
        </div>
        <PageTransition />
        <BootLoader />
        <LenisProvider />
        <Cursor />
        <MouseGlow />
        <KonamiTerminal />
        <ConsoleBanner />
        <DebugGrid />
      </body>
    </html>
  );
}
