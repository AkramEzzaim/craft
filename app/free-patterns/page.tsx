import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PatternCard } from "@/components/pattern-card";
import { isDraftPreview, listPatterns } from "@/lib/patterns";

type Props = { searchParams: Promise<{ page?: string | string[] }> };

const PAGE_SIZE = 9;
const description = "Browse colorful free crochet patterns, clear tutorials, and other handmade projects from Loop & Bloom Crochet.";
const pageHref = (page: number) => page === 1 ? "/free-patterns" : `/free-patterns?page=${page}`;

function pageNumber(value: string | string[] | undefined): number {
  if (value === undefined) return 1;
  if (typeof value !== "string" || !/^\d+$/.test(value)) notFound();
  const page = Number(value);
  if (!Number.isSafeInteger(page) || page < 1) notFound();
  return page;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const page = pageNumber((await searchParams).page);
  return {
    title: page === 1 ? "Free Crochet Patterns" : `Free Crochet Patterns — Page ${page}`,
    description,
    alternates: { canonical: pageHref(page) },
  };
}

export default async function Page({ searchParams }: Props) {
  const patterns = listPatterns();
  const page = pageNumber((await searchParams).page);
  const pageCount = Math.max(1, Math.ceil(patterns.length / PAGE_SIZE));
  if (page > pageCount) notFound();
  const start = (page - 1) * PAGE_SIZE;
  const visiblePatterns = patterns.slice(start, start + PAGE_SIZE);

  return <>
    <section className="collection-hero"><div className="container-wide"><span className="eyebrow">The pattern library</span><h1>Free patterns to make your own.</h1><p>Find your next crochet project, from a quick little motif to something useful for everyday life.</p><div className="collection-jump-links"><Link href="/crochet">All crochet</Link><Link href="/beginner">For beginners</Link><Link href="/granny-squares">Granny squares</Link><Link href="/quick-projects">Quick projects</Link></div></div></section>
    <section className="section container-wide collection-list">
      <div className="collection-count">{patterns.length} free {patterns.length === 1 ? "project" : "projects"}{isDraftPreview() && <span> · includes editorial drafts</span>}</div>
      {visiblePatterns.length ? <>
        <div className="card-grid">{visiblePatterns.map((pattern) => <PatternCard key={pattern.slug} pattern={pattern} />)}</div>
        {pageCount > 1 && <nav className="pattern-pagination" aria-label="Pattern pages">
          <span className="pattern-page-summary">Showing {start + 1}–{Math.min(start + PAGE_SIZE, patterns.length)} of {patterns.length}</span>
          <div className="pattern-page-links">
            {page > 1 && <Link href={pageHref(page - 1)} rel="prev" className="pattern-page-edge">← Previous</Link>}
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => <Link key={number} href={pageHref(number)} className={number === page ? "active" : undefined} aria-label={`Page ${number}`} aria-current={number === page ? "page" : undefined}>{number}</Link>)}
            {page < pageCount && <Link href={pageHref(page + 1)} rel="next" className="pattern-page-edge">Next →</Link>}
          </div>
        </nav>}
      </> : <div className="empty-state"><h2>Fresh patterns are taking shape.</h2><p>Our first projects will appear here when they are ready. In the meantime, explore the crochet categories.</p><Link href="/crochet" className="button button-dark">Explore crochet</Link></div>}
    </section>
  </>;
}
