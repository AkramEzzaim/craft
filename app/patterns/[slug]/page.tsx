import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Sparkles } from "lucide-react";
import { MarkdownArticle } from "@/components/markdown-article";
import { PatternCard } from "@/components/pattern-card";
import { SubscribeModal } from "@/components/subscribe-modal";
import { getPattern, isDraftPreview, listPatterns, relatedPatterns } from "@/lib/patterns";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return listPatterns().map((pattern) => ({ slug: pattern.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const pattern = getPattern(slug); if (!pattern) return {};
  return {
    title: pattern.seoTitle || pattern.title,
    description: pattern.metaDescription || pattern.description,
    alternates: { canonical: pattern.canonicalUrl || `/patterns/${pattern.slug}` },
    openGraph: { title: pattern.title, description: pattern.description, type: "article", publishedTime: pattern.publishedAt, modifiedTime: pattern.updatedAt || pattern.publishedAt, images: [pattern.pinterestImage || pattern.featuredImage] },
    robots: pattern.status === "draft" ? { index: false, follow: false } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params; const pattern = getPattern(slug); if (!pattern) notFound();
  const related = relatedPatterns(pattern);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", headline: pattern.title, description: pattern.description, image: new URL(pattern.featuredImage, siteUrl).toString(), datePublished: pattern.publishedAt, dateModified: pattern.updatedAt || pattern.publishedAt, author: { "@type": "Organization", name: pattern.author }, url: new URL(`/patterns/${pattern.slug}`, siteUrl).toString() };
  return <>
    {pattern.status === "draft" && isDraftPreview() && <div className="draft-notice">Draft preview · This tutorial needs human review before publication.</div>}
    {pattern.status === "published" && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}/>}
    <article>
      <div className="article-top container-wide"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={`/${pattern.category}`}>{pattern.category === "diy" ? "DIY" : pattern.category}</Link><span>/</span><span aria-current="page">{pattern.title}</span></nav><div className="article-top-grid"><div><span className="eyebrow">Free {pattern.category === "diy" ? "DIY tutorial" : `${pattern.category} pattern`}</span><h1>{pattern.title}</h1><p className="article-lead">{pattern.description}</p><div className="article-facts"><span><Sparkles size={18}/>{pattern.difficulty}</span>{pattern.estimatedTime && <span><Clock3 size={18}/>{pattern.estimatedTime}</span>}</div><div className="article-actions"><SubscribeModal patternId={pattern.slug} patternTitle={pattern.title}/><a href="#instructions" className="button button-outline">Read instructions</a></div><p className="article-byline">By {pattern.author} · {new Date(`${pattern.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</p></div><div className="article-hero-image"><Image src={pattern.featuredImage} alt={pattern.title} fill priority sizes="(max-width: 900px) 100vw, 50vw"/></div></div></div>
      <div className="article-layout container-wide"><aside className="article-sidebar"><div className="sidebar-box"><span className="eyebrow">In this project</span><a href="#at-a-glance">At a glance</a><a href="#materials">Materials</a><a href="#tools">Tools</a><a href="#instructions">Instructions</a><a href="#tips">Tips</a><a href="#common-mistakes">Common mistakes</a><a href="#faq">FAQ</a></div></aside><div className="article-body"><MarkdownArticle source={pattern.body}/><div className="article-download"><span className="eyebrow">Keep making</span><h2>Ready to start?</h2><p>Get easy access to this free pattern and occasional ideas for your next project.</p><SubscribeModal patternId={pattern.slug} patternTitle={pattern.title}/></div><div className="ad-placeholder" aria-label="Space reserved for future advertisements">Advertisement space</div></div></div>
    </article>
    {related.length > 0 && <section className="section container-wide related-section"><div className="section-heading"><div><span className="eyebrow">More to make</span><h2>You might also like</h2></div><Link href="/free-patterns" className="text-link">All free patterns <ArrowLeft className="rotate-180" size={17}/></Link></div><div className="card-grid">{related.map((item) => <PatternCard key={item.slug} pattern={item}/>)}</div></section>}
  </>;
}
