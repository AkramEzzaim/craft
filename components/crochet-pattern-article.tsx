import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, Lightbulb, Scissors } from "lucide-react";
import { MarkdownArticle } from "@/components/markdown-article";
import { PatternCard } from "@/components/pattern-card";
import { PatternFAQ } from "@/components/pattern-faq";
import { PatternNewsletter } from "@/components/pattern-newsletter";
import { SubscribeModal } from "@/components/subscribe-modal";
import { normalizeCrochetArticle, type ArticleRound } from "@/lib/pattern-article";
import type { Pattern } from "@/types/pattern";

function PatternHero({ pattern }: { pattern: Pattern }) {
  return <header className="craft-hero container-wide">
    <nav className="craft-breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/crochet">Crochet</Link><span aria-hidden="true">/</span><span aria-current="page">{pattern.title}</span></nav>
    <div className="craft-badges"><span>Free pattern</span><span>Step by step</span><span>Crochet</span></div>
    <h1>{pattern.title}</h1>{pattern.subtitle && <p className="craft-subtitle">{pattern.subtitle}</p>}<p>{pattern.description}</p>
    <div className="craft-hero-actions"><SubscribeModal patternId={pattern.slug} patternTitle={pattern.title}/><a className="button button-outline" href="#instructions">View the pattern <ArrowRight size={17} aria-hidden="true"/></a></div>
    <p className="craft-byline">By {pattern.author} · {new Date(`${pattern.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</p>
  </header>;
}

function ProjectMeta({ pattern, yarn, hook }: { pattern: Pattern; yarn?: string; hook?: string }) {
  const facts = [{ label: "Skill level", value: pattern.difficulty, icon: <span aria-hidden="true">◉</span> }];
  if (pattern.estimatedTime) facts.push({ label: "Time", value: pattern.estimatedTime, icon: <Clock3 size={19} aria-hidden="true"/> });
  if (yarn) facts.push({ label: "Yarn", value: yarn, icon: <span className="craft-meta-symbol" aria-hidden="true">✳</span> });
  if (hook) facts.push({ label: "Hook", value: hook, icon: <Scissors size={19} aria-hidden="true"/> });
  return <section className="craft-project-meta container-wide" aria-label="Project information">{facts.map((fact) => <div className="craft-meta-item" key={fact.label}><span className="craft-meta-icon">{fact.icon}</span><div><span>{fact.label}</span><strong>{fact.value}</strong></div></div>)}</section>;
}

function PatternFeaturedImage({ pattern }: { pattern: Pattern }) {
  return <figure className="craft-featured-image container-wide"><div><Image src={pattern.featuredImage} alt={pattern.imageAlt || `${pattern.title} crochet project`} fill preload sizes="(max-width: 760px) 100vw, 1100px"/></div></figure>;
}

function PatternRoundCard({ round, index }: { round: ArticleRound; index: number }) {
  return <section className="craft-round-card" aria-labelledby={`craft-round-${index}`}>
    <div className="craft-round-head"><span>{round.label}</span><h3 id={`craft-round-${index}`}>{round.title}</h3></div>
    {round.pattern && <div className="craft-round-pattern"><strong>Pattern</strong><p>{round.pattern}</p></div>}
    {round.steps.length > 0 && <div className="craft-round-steps"><strong>Step by step</strong><ol>{round.steps.map((step, stepIndex) => <li key={stepIndex}>{step}</li>)}</ol></div>}
    {(round.stitchCount || round.tip) && <div className="craft-round-extras">{round.stitchCount && <p><strong>Stitch count</strong> {round.stitchCount}</p>}{round.tip && <p><strong>Tip</strong> {round.tip}</p>}</div>}
    {round.image && <div className="craft-round-image"><Image src={round.image} alt={round.imageAlt || `${round.title} detail`} fill sizes="(max-width: 760px) 100vw, 680px" loading="lazy"/></div>}
  </section>;
}

export function CrochetPatternArticle({ pattern, related }: { pattern: Pattern; related: Pattern[] }) {
  const article = normalizeCrochetArticle(pattern);
  const navigation = [
    article.about.length > 0 && ["About", "about-this-pattern"],
    article.variations.length > 0 && ["Variations", "variations"],
    article.mistakes.length > 0 && ["Common mistakes", "common-mistakes"],
    (article.materials.length > 0 || article.tools.length > 0 || article.abbreviations.length > 0) && ["Materials", "materials"],
    (article.rounds.length > 0 || article.introduction.length > 0 || article.fallbackBody) && ["Main pattern", "instructions"],
    article.notes.length > 0 && ["Important notes", "important-notes"],
    article.gallery.length > 0 && ["More photos", "more-photos"],
    article.faq.length > 0 && ["FAQ", "faq"],
  ].filter((item): item is string[] => !!item);

  return <>
    <article className="craft-article">
      <PatternHero pattern={pattern}/>
      <ProjectMeta pattern={pattern} yarn={article.yarn} hook={article.hook}/>
      <PatternFeaturedImage pattern={pattern}/>
      <div className="craft-content-grid container-wide"><div className="craft-content-main">
        {article.about.length > 0 && <section className="craft-section craft-about-card" id="about-this-pattern" aria-labelledby="craft-about-title"><span className="eyebrow">The story behind the stitches</span><h2 id="craft-about-title">About this pattern</h2>{article.about.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</section>}

        {article.variations.length > 0 && <section className="craft-section" id="variations" aria-labelledby="craft-variations-title"><div className="craft-section-heading"><span className="eyebrow">Make it your own</span><h2 id="craft-variations-title">Variations</h2></div><div className="craft-variation-card">{article.variations.map((variation, index) => <div key={index}><h3>{variation.title}</h3><p>{variation.description}</p></div>)}</div></section>}

        {article.mistakes.length > 0 && <section className="craft-section" id="common-mistakes" aria-labelledby="craft-mistakes-title"><div className="craft-section-heading"><span className="eyebrow">A little help along the way</span><h2 id="craft-mistakes-title">Common mistakes</h2></div><div className="craft-mistakes-grid">{article.mistakes.map((mistake, index) => <div className="craft-mistake-card" key={index}><span>0{index + 1} / Troubleshooting</span><h3>{mistake.title}</h3><p>{mistake.explanation}</p>{mistake.fix && <p className="craft-mistake-fix"><strong>Try this</strong>{mistake.fix}</p>}</div>)}</div></section>}

        {(article.materials.length > 0 || article.tools.length > 0 || article.abbreviations.length > 0) && <section className="craft-section" id="materials" aria-labelledby="craft-materials-title"><div className="craft-section-heading"><span className="eyebrow">Gather your supplies</span><h2 id="craft-materials-title">{article.abbreviations.length > 0 && (article.materials.length > 0 || article.tools.length > 0) ? "Materials & abbreviations" : article.abbreviations.length > 0 ? "Abbreviations" : "Materials & tools"}</h2></div><div className="craft-materials-grid">{(article.materials.length > 0 || article.tools.length > 0) && <div className="craft-materials-card">{article.materials.length > 0 && <><h3>Materials</h3><ul>{article.materials.map((item, index) => <li key={index}>{item}</li>)}</ul></>}{article.tools.length > 0 && <><h3>Tools</h3><ul>{article.tools.map((item, index) => <li key={index}>{item}</li>)}</ul></>}</div>}{article.abbreviations.length > 0 && <div className="craft-abbreviations-card"><h3>Abbreviations</h3><dl>{article.abbreviations.map((item, index) => <div key={index}><dt>{item.code}</dt><dd>{item.meaning}</dd></div>)}</dl></div>}</div></section>}

        {(article.rounds.length > 0 || article.introduction.length > 0 || article.fallbackBody) && <section className="craft-section" id="instructions" aria-labelledby="craft-pattern-title"><div className="craft-section-heading"><span className="eyebrow">Stitch by stitch</span><h2 id="craft-pattern-title">Main pattern</h2></div>{article.introduction.map((paragraph, index) => <p className="craft-pattern-intro" key={index}>{paragraph}</p>)}{article.fallbackBody ? <MarkdownArticle source={article.fallbackBody}/> : <div className="craft-round-list">{article.rounds.map((round, index) => <PatternRoundCard key={`${round.title}-${index}`} round={round} index={index}/>)}</div>}</section>}

        {article.extraSections.map((extra, index) => <section className="craft-section craft-extra-section" key={index}><h2>{extra.title}</h2><MarkdownArticle source={extra.body}/></section>)}

        {article.notes.length > 0 && <section className="craft-section" id="important-notes" aria-labelledby="craft-notes-title"><div className="craft-section-heading"><span className="eyebrow">Before you finish</span><h2 id="craft-notes-title">Important notes</h2></div><ul className="craft-note-list">{article.notes.map((note, index) => <li key={index}><span><Lightbulb size={18} aria-hidden="true"/></span><p>{note}</p></li>)}</ul></section>}

        {article.gallery.length > 0 && <section className="craft-section" id="more-photos" aria-labelledby="craft-gallery-title"><div className="craft-section-heading"><span className="eyebrow">A closer look</span><h2 id="craft-gallery-title">More photos</h2></div><div className="craft-gallery">{article.gallery.map((photo, index) => <figure key={`${photo.src}-${index}`}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 760px) 100vw, 450px" loading="lazy"/></figure>)}</div></section>}

        <PatternFAQ items={article.faq}/>
      </div>
      {(navigation.length > 0 || article.details.length > 0) && <aside className="craft-content-sidebar" aria-label="On this page"><div className="craft-sidebar-card"><span className="eyebrow">In this pattern</span>{article.details.filter((detail) => !/^abbreviations?:/i.test(detail)).length > 0 && <ul className="craft-sidebar-details">{article.details.filter((detail) => !/^abbreviations?:/i.test(detail)).map((detail, index) => <li key={index}>{detail}</li>)}</ul>}{navigation.length > 0 && <nav aria-label="Article sections">{navigation.map(([label, href]) => <a key={href} href={`#${href}`}>{label}</a>)}</nav>}<div className="craft-sidebar-footer"><span>Ready when you are</span><SubscribeModal patternId={pattern.slug} patternTitle={pattern.title}/></div></div></aside>}
      </div>
    </article>

    <section className="craft-related container-wide" aria-labelledby="craft-related-title"><div className="craft-section-heading"><div><span className="eyebrow">Keep making</span><h2 id="craft-related-title">More patterns to try</h2></div><Link href="/crochet" className="text-link">Browse crochet <ArrowRight size={17} aria-hidden="true"/></Link></div>{related.length > 0 ? <div className="card-grid">{related.map((item) => <PatternCard key={item.slug} pattern={item}/>)}</div> : <p className="craft-related-empty">More patterns are being prepared. In the meantime, explore the <Link href="/beginner">beginner crochet collection</Link> or <Link href="/free-patterns">browse every published project</Link>.</p>}</section>

    <section className="craft-share container-wide" aria-labelledby="craft-share-title"><div><span className="eyebrow">Made something of your own?</span><h2 id="craft-share-title">We&apos;d love to see what you create.</h2><p>Share your project with Loop &amp; Bloom Crochet, or save this pattern for a quiet afternoon.</p></div><div className="craft-share-actions"><Link href="/contact" className="button button-dark">Share your pattern <ArrowRight size={18} aria-hidden="true"/></Link><a className="button button-outline" href={`https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(new URL(`/patterns/${pattern.slug}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").toString())}&media=${encodeURIComponent(new URL(pattern.pinterestImage || pattern.featuredImage, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").toString())}&description=${encodeURIComponent(pattern.pinterestDescription || pattern.description)}`} target="_blank" rel="noopener noreferrer">Save on Pinterest</a></div></section>
    <PatternNewsletter patternId={pattern.slug} patternTitle={pattern.title}/>
  </>;
}
