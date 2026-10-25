import type { Metadata } from "next";
import Script from "next/script";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";
import "./patterns/[slug]/crochet-article.css";
import "./brand.css";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Loop & Bloom Crochet | Free Crochet Patterns & Beginner Tutorials", template: "%s | Loop & Bloom Crochet" },
  description: "Discover colorful free crochet patterns, beginner-friendly tutorials, granny squares, quick projects, and handmade crochet inspiration from Loop & Bloom Crochet.",
  openGraph: { type: "website", siteName: "Loop & Bloom Crochet", title: "Loop & Bloom Crochet | Free Crochet Patterns & Beginner Tutorials", description: "Colorful free crochet patterns and clear tutorials for your next handmade project.", images: ["/images/patterns/beginner-granny-square.png"] },
  twitter: { card: "summary_large_image", title: "Loop & Bloom Crochet | Free Crochet Patterns", description: "Free crochet patterns, colorful projects, and beginner-friendly tutorials.", images: ["/images/patterns/beginner-granny-square.png"] },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: "Loop & Bloom Crochet", url: siteUrl, logo: `${siteUrl}/icon.svg` };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: "Loop & Bloom Crochet", url: siteUrl, potentialAction: { "@type": "SearchAction", target: `${siteUrl}/search?q={search_term_string}`, "query-input": "required name=search_term_string" } };
  return <html lang="en" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader/><main id="main-content">{children}</main><SiteFooter/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([organization, website]).replace(/</g, "\\u003c") }}/><Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4669042139242374" crossOrigin="anonymous" strategy="beforeInteractive" /></body></html>;
}
