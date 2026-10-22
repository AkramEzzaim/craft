import Link from "next/link";
import { ArrowRight } from "lucide-react";
export default function NotFound() { return <div className="not-found container-wide"><span className="eyebrow">A dropped stitch</span><h1>This page wandered off.</h1><p>We couldn&apos;t find what you were looking for. There are plenty of lovely projects to discover.</p><Link href="/free-patterns" className="button button-dark">Explore free patterns <ArrowRight size={18}/></Link></div>; }
