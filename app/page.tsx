import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Heart, Search } from "lucide-react";
import { NewsletterBanner } from "@/components/newsletter-banner";
import { PatternSection } from "@/components/pattern-section";
import { discovery, discoveryPatterns, type DiscoveryKey } from "@/lib/discovery";
import { isDraftPreview, listPatterns } from "@/lib/patterns";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const categoryOrder: DiscoveryKey[] = ["granny-squares", "quick-projects", "beginner", "amigurumi", "home-decor", "seasonal"];
const categoryImages: Record<DiscoveryKey, string> = {
  "granny-squares": "/images/patterns/beginner-granny-square.png",
  "quick-projects": "/images/patterns/easy-crochet-flower.png",
  beginner: "/images/patterns/beginner-crochet-tote-bag.png",
  amigurumi: "/images/crochet-strawberry.png",
  "home-decor": "/images/patterns/easy-crochet-coaster.png",
  seasonal: "/images/patterns/simple-crochet-heart.png",
  "tips-and-tutorials": "/images/patterns/beginner-granny-square.png",
};
const inspiration = [
  { src: "/images/patterns/easy-crochet-flower.png", alt: "Pink crochet flower with a yellow center", title: "Little floral details", href: "/quick-projects", className: "inspiration-flower" },
  { src: "/images/patterns/beginner-granny-square.png", alt: "Colorful handmade granny square", title: "Colorful squares", href: "/granny-squares", className: "inspiration-square" },
  { src: "/images/patterns/easy-crochet-coaster.png", alt: "Cream crochet coaster with a sage border", title: "For the everyday table", href: "/home-decor", className: "inspiration-coaster" },
  { src: "/images/patterns/simple-crochet-heart.png", alt: "Small pink crochet heart", title: "Something to give", href: "/seasonal", className: "inspiration-heart" },
];

export default function Home() {
  const patterns = listPatterns().filter((pattern) => pattern.category === "crochet");
  const popular = [...patterns.filter((pattern) => pattern.trending || pattern.featured), ...patterns.filter((pattern) => !pattern.trending && !pattern.featured)].slice(0, 3);
  const beginner = discoveryPatterns(patterns, "beginner").slice(0, 3);
  return <div className="home-page">
    {isDraftPreview() && <div className="draft-notice">Editorial preview includes draft tutorials awaiting review. Drafts are hidden in production.</div>}
    <section className="bloom-hero container-wide" aria-labelledby="home-title">
      <div className="bloom-hero-copy"><span className="eyebrow">Free crochet patterns for everyday makers</span><h1 id="home-title">Crochet something <em>beautiful</em> today.</h1><p>Discover colorful projects, clear tutorials, granny squares, and easy ideas to enjoy from the first stitch to the last.</p><div className="bloom-hero-actions"><Link className="button button-dark" href="/free-patterns">Explore Free Patterns <ArrowRight size={18} aria-hidden="true"/></Link><Link className="button button-outline" href="/beginner">Browse Beginner Patterns</Link></div><div className="bloom-hero-note"><span aria-hidden="true">〰</span> Pull up a chair. Your next project starts here.</div></div>
      <div className="bloom-hero-art" aria-label="Crochet project inspiration"><div className="hero-photo hero-photo-main"><Image src="/images/patterns/beginner-granny-square.png" alt="Colorful crochet granny square worked in cream, sage, and pink yarn" fill preload sizes="(max-width: 760px) 76vw, 480px"/></div><div className="hero-photo hero-photo-flower"><Image src="/images/patterns/easy-crochet-flower.png" alt="Pink crochet flower with a yellow yarn center" fill sizes="(max-width: 760px) 34vw, 210px"/></div><div className="hero-photo hero-photo-coaster"><Image src="/images/patterns/easy-crochet-coaster.png" alt="Handmade crochet coaster on linen" fill sizes="(max-width: 760px) 39vw, 235px"/></div><span className="hero-handwritten" aria-hidden="true">made one stitch<br/>at a time ↗</span></div>
    </section>
    <div className="bloom-ribbon"><div className="container-wide"><span>✿ Free patterns</span><span>〰 Clear tutorials</span><span>✿ Colorful ideas</span><span>〰 A little joy in every stitch</span></div></div>

    <section className="bloom-categories section container-wide" aria-labelledby="categories-title"><div className="section-heading"><div><span className="eyebrow">Follow the yarn</span><h2 id="categories-title">What would you like to crochet?</h2><p>Find a project for your mood, your time, and the yarn in your basket.</p></div><Link href="/crochet" className="text-link">All crochet ideas <ArrowRight size={17} aria-hidden="true"/></Link></div><div className="bloom-category-grid">{categoryOrder.map((key, index) => { const category = discovery[key]; return <Link href={`/${key}`} className={`bloom-category-card category-${category.color}`} key={key}><span className="category-number">0{index + 1}</span><div className="category-visual"><Image src={categoryImages[key]} alt="" fill sizes="(max-width: 600px) 42vw, (max-width: 1000px) 30vw, 190px"/></div><div className="category-copy"><h3>{category.title.replace(" Patterns", "").replace("Crochet for ", "")}</h3><p>{category.short}</p></div><ArrowUpRight size={21} aria-hidden="true"/></Link>; })}</div></section>

    <PatternSection eyebrow="From the pattern shelf" title="A pattern to explore" description="Find a lovely project and make it your own." patterns={popular} href="/free-patterns" linkLabel="View all patterns"/>

    <section className="beginner-feature container-wide" aria-labelledby="beginner-title"><div className="beginner-feature-copy"><span className="eyebrow">Your first stitches</span><h2 id="beginner-title">New to crochet? <em>Start here.</em></h2><p>Simple patterns, clear explanations, and small projects to help you build confidence one stitch at a time.</p><Link href="/beginner" className="button button-dark">Explore Beginner Patterns <ArrowRight size={17} aria-hidden="true"/></Link></div><div className="beginner-feature-list">{beginner.length ? beginner.map((pattern, index) => <Link href={`/patterns/${pattern.slug}`} className="beginner-mini" key={pattern.slug}><span>0{index + 1}</span><div><strong>{pattern.title}</strong><small>{pattern.difficulty}{pattern.estimatedTime ? ` · ${pattern.estimatedTime}` : ""}</small></div><ArrowUpRight size={18} aria-hidden="true"/></Link>) : <p>Beginner patterns are being reviewed. Browse the published collection while this section grows.</p>}</div></section>

    <section className="bloom-inspiration container-wide" aria-labelledby="inspiration-title"><div className="section-heading"><div><span className="eyebrow">A little color for your next make</span><h2 id="inspiration-title">A little crochet inspiration</h2><p>Flowers, squares, coasters, and sweet little details to spark an idea.</p></div></div><div className="inspiration-grid">{inspiration.map((item) => <Link href={item.href} className={`inspiration-tile ${item.className}`} key={item.src}><Image src={item.src} alt={item.alt} fill sizes="(max-width: 760px) 50vw, 33vw"/><span>{item.title} <ArrowUpRight size={16} aria-hidden="true"/></span></Link>)}</div></section>

    <NewsletterBanner/>

    <section className="bloom-why container-wide" aria-labelledby="why-title"><div className="bloom-why-heading"><span className="eyebrow">A note from Loop & Bloom</span><h2 id="why-title">Patterns made to be <em>enjoyed.</em></h2></div><div className="bloom-why-points"><div><BookOpen size={25} aria-hidden="true"/><h3>Easy to follow</h3><p>Project details, materials, and steps gathered in one clear place.</p></div><div><Heart size={25} aria-hidden="true"/><h3>Room to play</h3><p>Try a new color, use a favorite yarn, and make each project yours.</p></div><div><Search size={25} aria-hidden="true"/><h3>Find your next idea</h3><p>Explore beginner projects, quick makes, and crochet for your home.</p></div></div></section>

    <section className="bloom-seo container-wide" aria-labelledby="seo-title"><span className="eyebrow">Stay a while</span><h2 id="seo-title">Free crochet patterns for every kind of maker</h2><div><p>Some days call for a small project you can finish before dinner. Others are made for choosing colors, learning a new stitch, and letting a granny square grow slowly in your hands. Loop &amp; Bloom Crochet brings those moments together in one place, with free crochet patterns and tutorials you can browse whenever you feel ready to make.</p><p>Start with beginner crochet if you are getting comfortable with the hook. Try a flower, heart, or another quick crochet motif when you want a simple gift or a tiny handmade accent. Explore granny squares for color and rhythm, or choose a coaster and bring a little crochet into your home decor. Each pattern page keeps the useful details close: materials, project time, instructions, and tips when they are available. Find a project that suits the yarn you have and the time you can give it. There is always room for your own colors and your own way of making.</p></div><div className="bloom-seo-links"><Link href="/beginner">Beginner crochet <ArrowRight size={15}/></Link><Link href="/granny-squares">Granny squares <ArrowRight size={15}/></Link><Link href="/home-decor">Home & decor <ArrowRight size={15}/></Link></div></section>
  </div>;
}
