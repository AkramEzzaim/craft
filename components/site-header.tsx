"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand-lockup";

const categoryLinks = [
  ["Granny Squares", "/granny-squares"],
  ["Quick Crochet Projects", "/quick-projects"],
  ["Beginner Crochet", "/beginner"],
  ["Amigurumi", "/amigurumi"],
  ["Home & Decor", "/home-decor"],
  ["Seasonal Crochet", "/seasonal"],
] as const;

const primaryLinks = [
  ["Home", "/"],
  ["Patterns", "/free-patterns"],
  ["About", "/about"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopCategoriesOpen, setDesktopCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const desktopDropdownRef = useRef<HTMLDivElement>(null);
  const desktopToggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const categoriesActive = categoryLinks.some(([, href]) => pathname === href);
  const patternsActive = ["/free-patterns", "/crochet", "/knitting", "/diy"].includes(pathname) || pathname.startsWith("/patterns/");
  const isActive = (href: string) => href === "/free-patterns" ? patternsActive : pathname === href;

  useEffect(() => {
    if (!desktopCategoriesOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!desktopDropdownRef.current?.contains(event.target as Node)) setDesktopCategoriesOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopCategoriesOpen(false);
        desktopToggleRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [desktopCategoriesOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileCategoriesOpen(false);
  };

  const mainLink = ([label, href]: (typeof primaryLinks)[number]) =>
    <Link href={href} key={href} className={isActive(href) ? "active" : undefined} aria-current={pathname === href ? "page" : undefined} onClick={() => setDesktopCategoriesOpen(false)}>{label}</Link>;

  return <header className="site-header">
    <div className="header-inner container-wide">
      <BrandLockup />
      <nav className="desktop-nav" aria-label="Main navigation">
        {primaryLinks.slice(0, 2).map(mainLink)}
        <div className="nav-dropdown" ref={desktopDropdownRef}>
          <button ref={desktopToggleRef} type="button" className={categoriesActive ? "active" : undefined} aria-expanded={desktopCategoriesOpen} aria-controls="desktop-categories" onClick={() => setDesktopCategoriesOpen(!desktopCategoriesOpen)}>
            Categories <ChevronDown size={17} aria-hidden="true" className={desktopCategoriesOpen ? "chevron-open" : undefined} />
          </button>
          {desktopCategoriesOpen && <div className="nav-dropdown-panel" id="desktop-categories">
            <span className="nav-dropdown-heading">Explore by category</span>
            {categoryLinks.map(([label, href]) => <Link href={href} key={href} className={pathname === href ? "active" : undefined} aria-current={pathname === href ? "page" : undefined} onClick={() => setDesktopCategoriesOpen(false)}>{label}</Link>)}
          </div>}
        </div>
        {primaryLinks.slice(2).map(mainLink)}
      </nav>
      <div className="header-actions">
        <Link href="/search" className="icon-link" aria-label="Search patterns"><Search size={22} strokeWidth={2} /></Link>
        <button className="menu-toggle" type="button" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} aria-controls="mobile-navigation" onClick={() => { setMobileOpen(!mobileOpen); setMobileCategoriesOpen(false); }}>{mobileOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>
    </div>
    {mobileOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
      {primaryLinks.slice(0, 2).map(([label, href]) => <Link href={href} key={href} className={isActive(href) ? "active" : undefined} aria-current={pathname === href ? "page" : undefined} onClick={closeMobileMenu}>{label}</Link>)}
      <button type="button" className={`mobile-categories-toggle${categoriesActive ? " active" : ""}`} aria-expanded={mobileCategoriesOpen} aria-controls="mobile-categories" onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}>Categories <ChevronDown size={18} aria-hidden="true" className={mobileCategoriesOpen ? "chevron-open" : undefined} /></button>
      {mobileCategoriesOpen && <div className="mobile-categories" id="mobile-categories">
        {categoryLinks.map(([label, href]) => <Link href={href} key={href} className={pathname === href ? "active" : undefined} aria-current={pathname === href ? "page" : undefined} onClick={closeMobileMenu}>{label}</Link>)}
      </div>}
      {primaryLinks.slice(2).map(([label, href]) => <Link href={href} key={href} className={isActive(href) ? "active" : undefined} aria-current={pathname === href ? "page" : undefined} onClick={closeMobileMenu}>{label}</Link>)}
      <Link href="/search" onClick={closeMobileMenu}>Search patterns</Link>
    </nav>}
  </header>;
}
