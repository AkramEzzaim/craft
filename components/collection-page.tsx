import { PatternCard } from "@/components/pattern-card";
import { NewsletterBanner } from "@/components/newsletter-banner";
import { byCategory, isDraftPreview } from "@/lib/patterns";
import type { Category } from "@/types/pattern";

export function CollectionPage({ category, eyebrow, title, description }: { category: Category; eyebrow: string; title: string; description: string }) {
  const patterns = byCategory(category);
  return <><section className="collection-hero"><div className="container-wide"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div></section><section className="section container-wide collection-list"><div className="collection-count">{patterns.length} {patterns.length === 1 ? "project" : "projects"}{isDraftPreview() && <span> · Editorial draft preview</span>}</div>{patterns.length ? <div className="card-grid">{patterns.map((pattern) => <PatternCard key={pattern.slug} pattern={pattern}/>)}</div> : <div className="empty-state"><h2>New projects are on their way.</h2><p>We&apos;re reviewing this collection before sharing it. Please check back soon.</p></div>}</section><NewsletterBanner/></>;
}
