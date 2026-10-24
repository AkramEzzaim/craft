"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";

const links = [
  ["Home", "/"], ["Crochet", "/crochet"], ["Knitting", "/knitting"],
  ["DIY", "/diy"], ["Free Patterns", "/free-patterns"], ["About", "/about"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner container-wide">
      <Link href="/" className="brand" aria-label="Hearth and Thread, home" onClick={() => setOpen(false)}>
        <span className="brand-mark" aria-hidden="true">✳</span>
        <span>hearth <i>&</i> thread</span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <Link href="/search" className="icon-link" aria-label="Search patterns"><Search size={20} strokeWidth={1.8}/></Link>
        <Link href="/free-patterns" className="header-cta">Find a free pattern <span aria-hidden="true">↗</span></Link>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
      </div>
    </div>
    {open && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
      {links.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/search" onClick={() => setOpen(false)}>Search patterns</Link>
    </nav>}
  </header>;
}
