// One list drives both the pre-paint hiding CSS (rendered on the server) and the client observer,
// so a selector can never be hidden without also being revealed.
export type RevealVariant = "up" | "rise" | "fade" | "left" | "right" | "zoom" | "photo" | "curtain";

export type RevealGroup = { selector: string; variant: RevealVariant; step?: number };

export const revealGroups: RevealGroup[] = [
  // Homepage
  { selector: ".bloom-hero-copy>.eyebrow,.bloom-hero-copy>p,.bloom-hero-actions,.bloom-hero-note", variant: "up" },
  { selector: ".bloom-hero-copy>h1", variant: "rise" },
  { selector: ".hero-photo", variant: "photo", step: 140 },
  { selector: ".hero-handwritten", variant: "fade" },
  { selector: ".bloom-ribbon span", variant: "up", step: 70 },
  { selector: ".section-heading>div,.bloom-why-heading,.bloom-seo>.eyebrow,.bloom-seo>h2", variant: "up" },
  { selector: ".section-heading>.text-link", variant: "right" },
  { selector: ".bloom-category-card", variant: "zoom", step: 70 },
  { selector: ".beginner-feature", variant: "fade" },
  { selector: ".beginner-feature-copy>*", variant: "up" },
  { selector: ".beginner-mini", variant: "right", step: 100 },
  { selector: ".inspiration-tile", variant: "curtain", step: 110 },
  { selector: ".craft-newsletter,.newsletter-pending", variant: "rise" },
  { selector: ".bloom-why-points>div", variant: "up", step: 110 },
  { selector: ".bloom-seo>div", variant: "up" },

  // Listings, search, discovery
  { selector: ".collection-hero .container-wide>*,.discovery-hero .container-wide>*", variant: "up" },
  { selector: ".collection-count,.empty-state,.pattern-pagination", variant: "fade" },
  { selector: ".card-grid>.pattern-card", variant: "up", step: 90 },

  // Info, legal, contact
  { selector: ".info-page>*", variant: "up", step: 50 },
  { selector: ".contact-intro>*", variant: "left" },
  { selector: ".contact-form", variant: "rise" },

  // Pattern article
  { selector: ".craft-hero>*", variant: "up", step: 70 },
  { selector: ".craft-meta-item", variant: "up", step: 70 },
  { selector: ".craft-featured-image", variant: "curtain" },
  { selector: ".craft-section-heading,.craft-about-card,.craft-extra-section", variant: "up" },
  { selector: ".craft-variation-card,.craft-materials-grid>*,.craft-pattern-intro,.craft-note-list>li,.craft-faq-item", variant: "up", step: 70 },
  { selector: ".craft-mistake-card,.craft-round-card", variant: "up", step: 90 },
  { selector: ".craft-gallery>figure", variant: "curtain", step: 110 },
  { selector: ".craft-sidebar-card", variant: "right" },
  { selector: ".craft-related-empty,.craft-share", variant: "rise" },

  // Footer
  { selector: ".footer-main>*", variant: "up", step: 80 },
  { selector: ".footer-bottom", variant: "fade" },
];

export const revealSelector = revealGroups.map((group) => group.selector).join(",");

// Only hides while the inline head script has opted in, so no-JS visitors and reduced-motion users see everything.
export const revealHideCss = `@media screen{html.motion-ready :is(${revealSelector}):not([data-revealed]){opacity:0}}`;

// Runs before first paint. If the observer has not started within a few seconds (slow or failed hydration),
// the opt-in is withdrawn so content is never left hidden.
export const revealBootScript = `(function(){var d=document.documentElement;if(!window.matchMedia||matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window))return;d.classList.add("motion-ready");setTimeout(function(){if(!d.hasAttribute("data-motion"))d.classList.remove("motion-ready")},4000)})();`;
