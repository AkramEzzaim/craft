import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Hearth & Thread | Free Craft Patterns", template: "%s | Hearth & Thread" },
  description: "Modern, approachable crochet, knitting, and DIY projects for the joy of making by hand.",
  openGraph: { type: "website", siteName: "Hearth & Thread", images: ["/images/hero-crafts.png"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteHeader/><main id="main-content">{children}</main><SiteFooter/></body></html>;
}
