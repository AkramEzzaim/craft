import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Pattern } from "@/types/pattern";
import { patternUrl } from "@/lib/patterns";

export function PatternCard({ pattern }: { pattern: Pattern }) {
  return <article className="pattern-card group">
    <Link href={patternUrl(pattern)} className="card-image-wrap" aria-label={`View ${pattern.title}`}>
      <Image src={pattern.featuredImage} alt={pattern.imageAlt || pattern.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="card-image"/>
      {pattern.trending && <span className="image-badge">Popular project</span>}
    </Link>
    <div className="card-content">
      <div className="card-meta"><span>{pattern.category === "diy" ? "DIY craft" : pattern.category}</span><span>·</span><span>{pattern.difficulty}</span></div>
      <h3><Link href={patternUrl(pattern)}>{pattern.title}</Link></h3>
      <p>{pattern.description}</p>
      <div className="card-bottom"><span>{pattern.estimatedTime && <><Clock3 size={15}/>{pattern.estimatedTime}</>}</span><Link href={patternUrl(pattern)} className="card-link">View pattern <ArrowUpRight size={17}/></Link></div>
    </div>
  </article>;
}
