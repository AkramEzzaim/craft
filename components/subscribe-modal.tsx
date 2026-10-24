"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Download, X } from "lucide-react";

type Props = { patternId: string; patternTitle: string };

export function SubscribeModal({ patternId, patternTitle }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const opener = openerRef.current;
    document.body.style.overflow = "hidden";
    const firstField = dialogRef.current?.querySelector<HTMLInputElement>("input[name=name]");
    firstField?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), a[href]')];
      if (!focusable.length) return;
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus(); }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKeyDown); opener?.focus(); };
  }, [open]);

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
      const response = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        name, email, consent, website: String(form.get("website") || ""), pattern_id: patternId, pattern_title: patternTitle,
        source_url: window.location.href,
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
      }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not complete your request. Please try again.");
      setDownloadUrl(result.downloadUrl);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setLoading(false); }
  }

  return <>
    <button ref={openerRef} type="button" className="button button-dark" onClick={() => { setError(""); setOpen(true); }}><Download size={18}/> Get free pattern</button>
    {open && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef}>
        <button type="button" className="modal-close" aria-label="Close" onClick={() => setOpen(false)}><X size={20}/></button>
        {downloadUrl ? <div className="modal-success"><span className="success-icon"><Check size={28}/></span><span className="eyebrow">You&apos;re all set</span><h2 id="modal-title">Your free pattern is ready.</h2><p>Thanks for joining us. You can open the pattern now.</p><a className="button button-dark" href={downloadUrl} target="_blank" rel="noopener noreferrer">Open free pattern <ArrowRight size={18}/></a></div> : <>
          <span className="eyebrow">A little something for you</span><h2 id="modal-title">Get the free pattern</h2><p className="modal-intro">Enter your details to access <strong>{patternTitle}</strong> and receive occasional craft inspiration.</p>
          <form onSubmit={submit} noValidate>
            <label htmlFor="subscriber-name">Your name</label><input id="subscriber-name" name="name" type="text" maxLength={80} autoComplete="name" required/>
            <label htmlFor="subscriber-email">Email address</label><input id="subscriber-email" name="email" type="email" maxLength={254} autoComplete="email" required/>
            <div className="honeypot" aria-hidden="true"><label htmlFor="subscriber-website">Leave this empty</label><input id="subscriber-website" name="website" type="text" tabIndex={-1} autoComplete="off"/></div>
            <label className="checkbox-label"><input name="consent" type="checkbox" required/><span>I agree to receive the pattern and occasional craft emails. I can unsubscribe at any time. See the <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span></label>
            {error && <p className="form-error" role="alert">{error}</p>}
            <button type="submit" className="button button-dark modal-submit" disabled={loading}>{loading ? "Sending…" : "Send me the pattern"} <ArrowRight size={18}/></button>
          </form>
        </>}
      </div>
    </div>}
  </>;
}
