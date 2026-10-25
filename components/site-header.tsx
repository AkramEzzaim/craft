"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";

const links = [
  ["Home", "/"], ["Patterns", "/free-patterns"],
  ["Granny Squares", "/granny-squares"], ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const patternsActive = ["/free-patterns", "/crochet", "/beginner", "/quick-projects", "/amigurumi", "/home-decor", "/seasonal", "/knitting", "/diy"].includes(pathname) || pathname.startsWith("/patterns/");
  const isActive = (href: string) => href === "/free-patterns" ? patternsActive : pathname === href;
  return <header className="site-header">
    <div className="header-inner container-wide">
      <BrandLockup/>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => <Link href={href} key={href} className={isActive(href) ? "active" : undefined} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}
      </nav>
      <div className="header-actions">
        <Link href="/search" className="icon-link" aria-label="Search patterns"><Search size={22} strokeWidth={2}/></Link>
        <button className="menu-toggle" type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={24}/> : <Menu size={24}/>}</button>
      </div>
    </div>
    {open && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
      {links.map(([label, href]) => <Link href={href} key={href} className={isActive(href) ? "active" : undefined} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)}>{label}</Link>)}
      <Link href="/search" onClick={() => setOpen(false)}>Search patterns</Link>
    </nav>}
  </header>;
}
