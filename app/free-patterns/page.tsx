import type { Metadata } from "next";
import { PatternCard } from "@/components/pattern-card";
import { isDraftPreview, listPatterns } from "@/lib/patterns";

export const metadata: Metadata = { title: "Free Patterns", description: "Browse free crochet, knitting, and DIY craft patterns." };
export default function Page() { const patterns = listPatterns(); return <><section className="collection-hero"><div className="container-wide"><span className="eyebrow">Made to share</span><h1>Free patterns to fall in love with.</h1><p>Find your next handmade project, from quick gifts to cozy keepsakes.</p></div></section><section className="section container-wide collection-list"><div className="collection-count">All free projects {isDraftPreview() && <span> · Editorial draft preview</span>}</div>{patterns.length ? <div className="card-grid">{patterns.map((pattern) => <PatternCard key={pattern.slug} pattern={pattern}/>)}</div> : <div className="empty-state"><h2>We&apos;re putting the finishing touches on our patterns.</h2><p>Our first projects will appear here after editorial review.</p></div>}</section></>; }
