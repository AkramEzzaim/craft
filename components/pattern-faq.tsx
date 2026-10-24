"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { ArticleFaq } from "@/lib/pattern-article";

export function PatternFAQ({ items }: { items: ArticleFaq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!items.length) return null;
  return <section className="craft-section" id="faq" aria-labelledby="craft-faq-title">
    <div className="craft-section-heading"><span className="eyebrow">Good to know</span><h2 id="craft-faq-title">Frequently asked questions</h2></div>
    <div className="craft-faq-list">{items.map((item, index) => {
      const expanded = open === index;
      const panelId = `craft-faq-answer-${index}`;
      return <div className="craft-faq-item" key={`${item.question}-${index}`}>
        <h3><button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => setOpen(expanded ? null : index)}>{item.question}<Plus size={21} aria-hidden="true" className={expanded ? "craft-faq-icon is-open" : "craft-faq-icon"}/></button></h3>
        <div id={panelId} hidden={!expanded}><p>{item.answer}</p></div>
      </div>;
    })}</div>
  </section>;
}
