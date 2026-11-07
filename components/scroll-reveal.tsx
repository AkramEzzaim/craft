"use client";

import { useEffect } from "react";
import { revealGroups, revealSelector, type RevealGroup } from "@/lib/reveal";

const DEFAULT_STEP = 80;
const MAX_DELAY = 640;

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("motion-ready")) return;
    root.setAttribute("data-motion", "on");

    const groups = new WeakMap<Element, RevealGroup>();

    const finish = (event: AnimationEvent) => {
      const element = event.target as HTMLElement;
      if (!event.animationName.startsWith("reveal-") || !groups.has(element)) return;
      element.setAttribute("data-revealed", "done");
      element.style.removeProperty("--reveal-delay");
    };

    // Everything that enters together is staggered in document order, so grids fill in row by row.
    const observer = new IntersectionObserver((entries) => {
      // Wait until a meaningful slice is on screen; tall sections qualify by visible height instead of ratio.
      const entering = entries.filter((entry) => entry.isIntersecting && (entry.intersectionRatio >= 0.15 || entry.intersectionRect.height >= window.innerHeight * 0.12))
        .map((entry) => entry.target as HTMLElement)
        .sort((a, b) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);
      let delay = 0;
      for (const element of entering) {
        observer.unobserve(element);
        element.style.setProperty("--reveal-delay", `${Math.min(delay, MAX_DELAY)}ms`);
        element.setAttribute("data-revealed", "");
        delay += groups.get(element)?.step ?? DEFAULT_STEP;
      }
    }, { threshold: [0, 0.05, 0.1, 0.15] });

    const scan = () => {
      for (const element of document.querySelectorAll<HTMLElement>(revealSelector)) {
        if (groups.has(element) || element.hasAttribute("data-revealed")) continue;
        const group = revealGroups.find((item) => element.matches(item.selector));
        if (!group) continue;
        groups.set(element, group);
        element.setAttribute("data-reveal", group.variant);
        observer.observe(element);
      }
    };

    // Client navigations and late-rendering client components add new sections without remounting this component.
    let frame = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });

    scan();
    mutations.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("animationend", finish);
    return () => {
      cancelAnimationFrame(frame);
      mutations.disconnect();
      observer.disconnect();
      document.removeEventListener("animationend", finish);
    };
  }, []);

  return null;
}
