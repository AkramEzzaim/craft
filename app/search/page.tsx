import type { Metadata } from "next";
import { Search } from "lucide-react";
import { PatternCard } from "@/components/pattern-card";
import { searchPatterns } from "@/lib/patterns";

export const metadata: Metadata = { title: "Search Patterns", robots: { index: false, follow: true } };
export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q = "" } = await searchParams; const query = (Array.isArray(q) ? q[0] || "" : q).trim().slice(0, 80); const patterns = searchPatterns(query);
  return <><section className="collection-hero"><div className="container-wide"><span className="eyebrow">Find your next project</span><h1>Search the studio.</h1><p>Look for a craft, material, or project you want to make.</p><form action="/search" method="get" className="search-form"><label htmlFor="pattern-search" className="sr-only">Search patterns</label><Search size={21}/><input id="pattern-search" name="q" defaultValue={query} placeholder="Try crochet, cozy, flowers..." maxLength={80}/><button type="submit">Search</button></form></div></section><section className="section container-wide collection-list">{query && <div className="collection-count">{patterns.length} {patterns.length === 1 ? "result" : "results"} for “{query}”</div>}{patterns.length ? <div className="card-grid">{patterns.map((pattern) => <PatternCard key={pattern.slug} pattern={pattern}/>)}</div> : <div className="empty-state"><h2>{query ? "No projects found yet." : "Start with a little inspiration."}</h2><p>{query ? "Try a different craft or a simpler search term." : "Enter a word above to explore the collection."}</p></div>}</section></>;
}
