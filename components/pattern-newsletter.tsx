"use client";

import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";

export function PatternNewsletter({ patternId, patternTitle, home = false }: { patternId: string; patternTitle: string; home?: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const consent = form.get("consent") === "on";
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !consent) { setError("Please enter your name, a valid email, and your consent."); return; }
    const params = new URLSearchParams(window.location.search);
    setLoading(true);
    try {
      const response = await fetch("/api/subscribe", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, consent, website: String(form.get("website") || ""),
          pattern_id: patternId, pattern_title: patternTitle, source_url: window.location.href,
          utm_source: params.get("utm_source") || "", utm_medium: params.get("utm_medium") || "", utm_campaign: params.get("utm_campaign") || "",
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Please try again shortly.");
      setDownloadUrl(result.downloadUrl);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again shortly."); }
    finally { setLoading(false); }
  }

  return <section className={home ? "craft-newsletter craft-newsletter-home container-wide" : "craft-newsletter container-wide"} id="newsletter" aria-labelledby="craft-newsletter-title">
    <div className="craft-newsletter-copy"><div className="craft-newsletter-mark"><Mail size={24} aria-hidden="true"/></div><span className="eyebrow">A note from the studio</span><h2 id="craft-newsletter-title">{home ? "A little crochet inspiration in your inbox" : "New patterns, straight to your inbox."}</h2><p>{home ? `Start with “${patternTitle}” and receive occasional crochet ideas for what to make next.` : `Get access to ${patternTitle} and occasional ideas for what to make next.`}</p></div>
    {downloadUrl ? <div className="craft-newsletter-success" role="status"><strong>Your pattern is ready.</strong><a href={downloadUrl} className="button button-light">Open free pattern <ArrowRight size={17} aria-hidden="true"/></a></div> :
      <form className="craft-newsletter-form" onSubmit={submit} noValidate>
        <label htmlFor="craft-newsletter-name">Your name</label><input id="craft-newsletter-name" name="name" type="text" autoComplete="name" maxLength={80} required/>
        <label htmlFor="craft-newsletter-email">Email address</label><input id="craft-newsletter-email" name="email" type="email" autoComplete="email" maxLength={254} required/>
        <div className="honeypot" aria-hidden="true"><label htmlFor="craft-newsletter-website">Leave this empty</label><input id="craft-newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off"/></div>
        <label className="craft-newsletter-consent"><input name="consent" type="checkbox" required/><span>I agree to receive the pattern and occasional craft emails. I can unsubscribe at any time. See the <a href="/privacy">Privacy Policy</a>.</span></label>
        {error && <p className="craft-newsletter-error" role="alert">{error}</p>}
        <button type="submit" className="button button-light" disabled={loading}>{loading ? "Sending…" : home ? "Send Me Patterns" : "Get the pattern & subscribe"}<ArrowRight size={17} aria-hidden="true"/></button>
      </form>}
  </section>;
}
