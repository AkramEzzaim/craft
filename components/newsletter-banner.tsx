import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

export function NewsletterBanner() {
  return <section className="newsletter-wrap container-wide">
    <div className="newsletter-card">
      <div className="newsletter-icon"><Heart size={24} strokeWidth={1.4}/></div>
      <div><span className="eyebrow">A pattern for your next quiet afternoon</span><h2>Good things take a little making.</h2><p>Explore our free projects and choose one to make your own.</p></div>
      <Link className="button button-light" href="/free-patterns">Find a free pattern <ArrowRight size={18}/></Link>
    </div>
  </section>;
}
