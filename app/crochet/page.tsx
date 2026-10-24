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
        <h1>Crochet Patterns</h1>
        <p>Start with a quick flower or heart, practice a classic granny square, then make something useful for everyday life. Each project is designed to feel approachable, one stitch at a time.</p>
      </div>
    </section>
    <PatternSection eyebrow="A lovely place to start" title="Featured crochet projects" description="Handpicked ideas for your next afternoon with yarn." patterns={featured}/>
    <PatternSection eyebrow="Learn as you make" title="Beginner-friendly crochet" description="Small, satisfying projects for practicing the basics." patterns={beginner}/>
    <section className="section container-wide collection-list">
      <div className="section-heading"><div><span className="eyebrow">The full collection</span><h2>All crochet patterns</h2><p>Browse every crochet project in the studio.</p></div></div>
      <div className="collection-count">{patterns.length} {patterns.length === 1 ? "project" : "projects"}{isDraftPreview() && <span> · Editorial draft preview</span>}</div>
      {patterns.length ? <div className="card-grid">{patterns.map((pattern) => <PatternCard key={pattern.slug} pattern={pattern}/>)}</div> : <div className="empty-state"><h2>New crochet projects are on their way.</h2><p>Our tutorials are being reviewed before publication. Please check back soon.</p></div>}
    </section>
    <NewsletterBanner/>
  </>;
}
