"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";

const links = [
  ["Free Patterns", "/free-patterns"], ["Beginner", "/beginner"],
  ["Granny Squares", "/granny-squares"], ["Amigurumi", "/amigurumi"],
  ["Home & Decor", "/home-decor"], ["Tips & Tutorials", "/tips-and-tutorials"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header">
    <div className="header-inner container-wide">
      <BrandLockup/>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <Link href="/search" className="icon-link" aria-label="Search patterns"><Search size={20} strokeWidth={1.8}/></Link>
        <Link href="/search" className="header-cta">Find a Pattern <span aria-hidden="true">↗</span></Link>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
      </div>
    </div>
    {open && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
      <Link href="/" onClick={() => setOpen(false)}>Home</Link>
      {links.map(([label, href]) => <Link href={href} key={href} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/search" onClick={() => setOpen(false)}>Search patterns</Link>
    </nav>}
  </header>;
}
