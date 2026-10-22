import Link from "next/link";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container-wide footer-main">
      <div>
        <Link href="/" className="brand footer-brand"><span className="brand-mark" aria-hidden="true">✳</span><span>hearth <i>&</i> thread</span></Link>
        <p>Simple projects for the joy of making something by hand.</p>
      </div>
      <div className="footer-links"><strong>Explore</strong><Link href="/crochet">Crochet</Link><Link href="/knitting">Knitting</Link><Link href="/diy">DIY crafts</Link><Link href="/free-patterns">Free patterns</Link></div>
      <div className="footer-links"><strong>Information</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
    </div>
    <div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} Hearth & Thread</span><span>Made for curious hands and quiet afternoons.</span></div>
  </footer>;
}
