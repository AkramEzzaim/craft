import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Pattern } from "@/types/pattern";
import { patternUrl } from "@/lib/patterns";

export function PatternCard({ pattern }: { pattern: Pattern }) {
  return <article className={`pattern-card pattern-card-${pattern.category}`}>
    <Link href={patternUrl(pattern)} className="card-image-wrap" aria-label={`View ${pattern.title}`}>
      <Image src={pattern.featuredImage} alt={pattern.imageAlt || pattern.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="card-image"/>
      <span className="image-badge">{pattern.category === "crochet" ? "Crochet pattern" : pattern.category === "knitting" ? "Knitting" : "DIY craft"}</span>
    </Link>
    <div className="card-content">
      <div className="card-meta"><span>{pattern.category === "diy" ? "DIY craft" : pattern.category}</span><span aria-hidden="true">/</span><span>{pattern.difficulty}</span></div>
      <h3><Link href={patternUrl(pattern)}>{pattern.title}</Link></h3>
      <p>{pattern.description}</p>
      <div className="card-bottom"><span>{pattern.estimatedTime && <><Clock3 size={15} aria-hidden="true"/>{pattern.estimatedTime}</>}</span><Link href={patternUrl(pattern)} className="card-link">View pattern <ArrowUpRight size={17} aria-hidden="true"/></Link></div>
    </div>
  </article>;
}
