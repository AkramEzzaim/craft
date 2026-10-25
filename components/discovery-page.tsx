import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PatternCard } from "@/components/pattern-card";
import { NewsletterBanner } from "@/components/newsletter-banner";
import { discovery, discoveryPatterns, type DiscoveryKey } from "@/lib/discovery";
import { isDraftPreview, listPatterns } from "@/lib/patterns";

export function DiscoveryPage({ category }: { category: DiscoveryKey }) {
  const info = discovery[category];
  const patterns = discoveryPatterns(listPatterns(), category);
  return <>
    <header className={`discovery-hero discovery-${info.color}`}><div className="container-wide"><span className="eyebrow">Find your next make</span><h1>{info.title}</h1><p>{info.intro}</p><Link href="/free-patterns" className="text-link">Browse all free patterns <ArrowRight size={18} aria-hidden="true"/></Link></div></header>
    <section className="section container-wide collection-list"><div className="collection-count">{patterns.length} {patterns.length === 1 ? "pattern" : "patterns"}{isDraftPreview() && <span> · includes editorial drafts</span>}</div>
      {patterns.length ? <div className="card-grid">{patterns.map((pattern) => <PatternCard pattern={pattern} key={pattern.slug}/>)}</div> : <div className="empty-state discovery-empty"><h2>More stitches are on the way.</h2><p>There isn&apos;t a published pattern in this collection yet. Browse the free patterns that are ready now.</p><Link href="/free-patterns" className="button button-dark">Explore free patterns <ArrowRight size={17} aria-hidden="true"/></Link></div>}
    </section>
    <NewsletterBanner/>
  </>;
}
