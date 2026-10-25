import Link from "next/link";

export function BrandLockup({ footer = false }: { footer?: boolean }) {
  return <Link href="/" className={footer ? "brand-lockup brand-lockup-footer" : "brand-lockup"} aria-label="Loop & Bloom Crochet, home">
    <svg className="brand-flower" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M31.9 28.9c-6.9-15.5-18.7-11.8-17.9-2.5.4 5.2 5.9 8.6 17.9 9.3M35.1 29C42.2 13.6 53.9 17.6 53 26.6c-.6 5.1-6.2 8.4-17.9 9.4M36.2 32.3c16.8-2.4 20.3 9.5 12.4 14.1-4.5 2.7-10.5.8-16.4-10.1M30.6 34c12.2 11.8 5 21.8-3.5 17.8-4.7-2.1-6.3-8.2-2.7-18.4M28.8 31.8C12.1 29.4 8.7 41.4 16.6 46c4.6 2.7 10.6.7 16.5-10.2" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="32" cy="32" r="4" fill="currentColor"/>
      <path d="M48 46c5.8 1.3 9.3 4.3 10.1 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    </svg>
    <span className="brand-wording"><strong>Loop <em>&</em> Bloom</strong><small>FREE CROCHET PATTERNS & IDEAS</small></span>
  </Link>;
}
