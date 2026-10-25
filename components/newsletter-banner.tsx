import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PatternNewsletter } from "@/components/pattern-newsletter";
import { listPatterns } from "@/lib/patterns";

export function NewsletterBanner() {
  const first = listPatterns(false).find((pattern) => pattern.category === "crochet");
  if (first) return <PatternNewsletter patternId={first.slug} patternTitle={first.title} home/>;
  return <section className="newsletter-pending container-wide" id="newsletter"><span className="eyebrow">From the studio</span><h2>New patterns are growing here.</h2><p>Our first crochet tutorials are being prepared. See what is ready to make.</p><Link className="button button-dark" href="/free-patterns">Browse free patterns <ArrowRight size={18} aria-hidden="true"/></Link></section>;
}
