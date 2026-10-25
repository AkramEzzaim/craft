import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="container-wide footer-main">
      <div className="footer-intro">
        <BrandLockup footer/>
        <p>Colorful free crochet patterns, simple tutorials, and handmade inspiration for your next project.</p>
        <Link href="/#newsletter" className="footer-newsletter-link">Get pattern notes in your inbox <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="footer-links"><strong>Explore</strong><Link href="/free-patterns">Free Patterns</Link><Link href="/beginner">Beginner Crochet</Link><Link href="/granny-squares">Granny Squares</Link><Link href="/amigurumi">Amigurumi</Link><Link href="/home-decor">Home & Decor</Link><Link href="/tips-and-tutorials">Tips & Tutorials</Link></div>
      <div className="footer-links"><strong>Information</strong><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
      <div className="footer-social"><strong>Social</strong><p>Find us on Pinterest, Instagram, and Facebook when our profiles open.</p><Link href="/contact">Say hello <span aria-hidden="true">↗</span></Link></div>
    </div>
    <div className="container-wide footer-bottom"><span>© {new Date().getFullYear()} Loop & Bloom Crochet</span><span>Small projects, bright ideas, one stitch at a time.</span></div>
  </footer>;
}
