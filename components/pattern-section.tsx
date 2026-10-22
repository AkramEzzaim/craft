import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PatternCard } from "@/components/pattern-card";
import type { Pattern } from "@/types/pattern";

export function PatternSection({ eyebrow, title, description, patterns, href, linkLabel }: { eyebrow?: string; title: string; description?: string; patterns: Pattern[]; href?: string; linkLabel?: string }) {
  if (!patterns.length) return null;
  return <section className="section container-wide">
    <div className="section-heading">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
      {href && <Link href={href} className="text-link">{linkLabel || "Explore all"} <ArrowRight size={17}/></Link>}
    </div>
    <div className="card-grid">{patterns.map((pattern) => <PatternCard key={pattern.slug} pattern={pattern}/>)}</div>
  </section>;
}
