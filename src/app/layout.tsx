import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Instrument_Sans } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { profile } from "@/content/profile";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "AJDER", template: "%s - AJDER" },
  description: "Milan Ajder builds software, researches AI-assisted development, and documents professional side quests.",
  keywords: ["Milan Ajder", "Software Engineer", "AI-assisted software development", "developer productivity research", "Novi Sad", "Serbia"],
  authors: [{ name: profile.name }],
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website", locale: "en_US", siteName: "AJDER",
    title: "AJDER",
    description: "Software, research, and professional side quests by Milan Ajder.",
  },
  twitter: { card: "summary_large_image", title: "AJDER", description: "Software, research, and professional side quests by Milan Ajder." },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "dark", themeColor: "#111411" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  homeLocation: { "@type": "Place", name: profile.location },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Faculty of Technical Sciences, University of Novi Sad" },
  sameAs: [profile.links.github, profile.links.linkedin],
  knowsAbout: profile.interests,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${instrument.variable} ${plexMono.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AnalyticsConsent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
