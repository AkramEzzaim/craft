import type { Metadata } from "next";
import { NewsletterBanner } from "@/components/newsletter-banner";
import { PatternCard } from "@/components/pattern-card";
import { PatternSection } from "@/components/pattern-section";
import { byCategory, isDraftPreview } from "@/lib/patterns";

export const metadata: Metadata = {
  title: "Crochet Patterns",
  description: "Explore free crochet patterns, from quick flowers and hearts to granny squares, coasters, and a handmade tote.",
  alternates: { canonical: "/crochet" },
};

export default function CrochetPage() {
  const patterns = byCategory("crochet");
  const featured = patterns.filter((pattern) => pattern.featured).slice(0, 3);
  const beginner = patterns.filter((pattern) => pattern.beginnerFriendly && !featured.some((item) => item.slug === pattern.slug)).slice(0, 3);

  return <>
    <section className="collection-hero">
      <div className="container-wide">
        <span className="eyebrow">The crochet collection</span>
        <h1>Free crochet patterns for your next make.</h1>
        <p>Explore colorful motifs, cozy home ideas, and beginner-friendly projects. Pick a pattern that feels right for today and make it your own.</p>
        <div className="collection-jump-links"><a href="/beginner">Beginner crochet</a><a href="/granny-squares">Granny squares</a><a href="/quick-projects">Quick makes</a><a href="/home-decor">Home & decor</a></div>
      </div>
    </section>
    <PatternSection eyebrow="A lovely place to start" title="Featured crochet projects" description="Handpicked ideas for your next afternoon with yarn." patterns={featured}/>
    <PatternSection eyebrow="Learn as you make" title="Beginner-friendly crochet" description="Small, satisfying projects for practicing the basics." patterns={beginner}/>
    <section className="section container-wide collection-list">
      <div className="section-heading"><div><span className="eyebrow">The full collection</span><h2>All crochet patterns</h2><p>Find the one that makes you want to reach for your hook.</p></div></div>
      <div className="collection-count">{patterns.length} {patterns.length === 1 ? "project" : "projects"}{isDraftPreview() && <span> · Editorial draft preview</span>}</div>
      {patterns.length ? <div className="card-grid">{patterns.map((pattern) => <PatternCard key={pattern.slug} pattern={pattern}/>)}</div> : <div className="empty-state"><h2>New crochet projects are on their way.</h2><p>Our tutorials are being reviewed before publication. Please check back soon.</p></div>}
    </section>
    <NewsletterBanner/>
  </>;
}
