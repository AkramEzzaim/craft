import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Scissors, Sparkles, Sprout } from "lucide-react";
import { PatternSection } from "@/components/pattern-section";
import { NewsletterBanner } from "@/components/newsletter-banner";
import { byCategory, featuredPatterns, isDraftPreview, listPatterns } from "@/lib/patterns";

export default function Home() {
  const patterns = listPatterns();
  return <>
    {isDraftPreview() && <div className="draft-notice">Editorial preview: sample patterns are drafts awaiting human review. They are hidden in production.</div>}
    <section className="hero container-wide">
      <div className="hero-image"><Image src="/images/hero-crafts.png" alt="Yarn, crochet squares and handmade supplies on a sunlit table" fill priority sizes="100vw"/></div>
      <div className="hero-copy"><span className="eyebrow">For the joy of making</span><h1>Discover beautiful <em>free craft patterns.</em></h1><p>Crochet, knitting, and DIY projects made simple. Find a little inspiration for your next quiet afternoon.</p><div className="hero-buttons"><Link href="/free-patterns" className="button button-dark">Explore free patterns <ArrowRight size={18}/></Link><Link href="/crochet" className="button button-outline">Browse crochet</Link></div></div>
      <div className="hero-sticker" aria-hidden="true"><span>make with<br/>love</span><Sparkles size={18}/></div>
    </section>
    <div className="intro-bar container-wide"><span><Sparkles size={20}/> Simple & satisfying</span><span><Sprout size={20}/> Made by hand</span><span><Scissors size={20}/> Beginner friendly</span></div>
    <PatternSection eyebrow="Start here" title="Featured free patterns" description="Lovely projects to start, finish, and feel proud of." patterns={featuredPatterns().slice(0, 3)} href="/free-patterns" linkLabel="All free patterns"/>
    <PatternSection eyebrow="Fresh inspiration" title="Trending crafts" description="A few handmade ideas catching our eye." patterns={patterns.filter((pattern) => pattern.trending).slice(0, 3)} href="/free-patterns"/>
    {!patterns.length && <section className="empty-home container-wide"><span className="eyebrow">Coming soon</span><h2>A collection is taking shape.</h2><p>Our first patterns are being checked before they go live. In the meantime, explore the craft categories below.</p></section>}
    <section className="category-section"><div className="container-wide"><div className="section-heading"><div><span className="eyebrow">Choose your craft</span><h2>What will you make today?</h2><p>Find a project that suits your mood and your hands.</p></div></div><div className="category-grid">
      <Link href="/crochet" className="category-tile tile-crochet"><div><span>01 / make with yarn</span><h3>Crochet</h3><p>Small joys, one stitch at a time.</p></div><ArrowUpRight size={24}/></Link>
      <Link href="/knitting" className="category-tile tile-knitting"><div><span>02 / slow & cozy</span><h3>Knitting</h3><p>Warm layers and simple textures.</p></div><ArrowUpRight size={24}/></Link>
      <Link href="/diy" className="category-tile tile-diy"><div><span>03 / make it yours</span><h3>DIY crafts</h3><p>Thoughtful projects for everyday life.</p></div><ArrowUpRight size={24}/></Link>
    </div></div></section>
    <PatternSection eyebrow="Fresh from the studio" title="Latest patterns" patterns={patterns.slice(0, 3)} href="/free-patterns"/>
    <PatternSection eyebrow="One stitch at a time" title="Crochet projects to try" patterns={byCategory("crochet").slice(0, 3)} href="/crochet"/>
    <PatternSection eyebrow="A little weekend project" title="Latest DIY tutorials" patterns={byCategory("diy").slice(0, 3)} href="/diy"/>
    <PatternSection eyebrow="An easy place to begin" title="Beginner-friendly patterns" patterns={patterns.filter((pattern) => pattern.beginnerFriendly).slice(0, 3)} href="/free-patterns"/>
    <NewsletterBanner/>
  </>;
}
