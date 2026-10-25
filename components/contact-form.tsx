"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "draft";

export function ContactForm({ email, deliveryConfigured }: { email: string; deliveryConfigured: boolean }) {
  const [status, setStatus] = useState<Status>("idle");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    const name = String(fields.get("name") || "").trim();
    const senderEmail = String(fields.get("email") || "").trim();
    const subject = String(fields.get("subject") || "").trim();
    const message = String(fields.get("message") || "").trim();
    const website = String(fields.get("website") || "");
    setStatus("sending");

    if (deliveryConfigured) {
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: senderEmail, subject, message, website }),
        });
        if (response.ok) {
          form.reset();
          setStatus("sent");
          return;
        }
      } catch {
        // Keep the visitor's message and offer their email app if delivery fails.
      }
    }

    const draftSubject = encodeURIComponent(`[Loop & Bloom] ${subject}`);
    const draftBody = encodeURIComponent(`${message}\n\nFrom: ${name} <${senderEmail}>`);
    window.location.href = `mailto:${email}?subject=${draftSubject}&body=${draftBody}`;
    setStatus("draft");
  }

  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-form-row">
      <div className="contact-field"><label htmlFor="contact-name">Your name <span aria-hidden="true">*</span></label><input id="contact-name" name="name" type="text" autoComplete="name" maxLength={80} placeholder="Your name" required /></div>
      <div className="contact-field"><label htmlFor="contact-email">Email address <span aria-hidden="true">*</span></label><input id="contact-email" name="email" type="email" autoComplete="email" maxLength={254} placeholder="you@example.com" required /></div>
    </div>
    <div className="contact-field"><label htmlFor="contact-subject">What&apos;s this about? <span aria-hidden="true">*</span></label><select id="contact-subject" name="subject" defaultValue="" required><option value="" disabled>Choose a topic</option><option value="Pattern question">Pattern question</option><option value="Pattern correction">Pattern correction</option><option value="Collaboration">Collaboration</option><option value="Just saying hello">Just saying hello</option><option value="Something else">Something else</option></select></div>
    <div className="contact-field"><label htmlFor="contact-message">Your message <span aria-hidden="true">*</span></label><textarea id="contact-message" name="message" rows={7} minLength={10} maxLength={5000} placeholder="Tell us a little more..." required /></div>
    <div className="honeypot" aria-hidden="true"><label htmlFor="contact-website">Leave this empty</label><input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <div className="contact-form-bottom">
      <p>{deliveryConfigured ? "We'll use your email only to reply to your message." : "This opens your email app with your message ready to send."}</p>
      <button className="button button-dark" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : deliveryConfigured ? "Send message" : "Prepare email"} <ArrowRight size={17} aria-hidden="true" /></button>
    </div>
    {status === "sent" && <p className="contact-status contact-status-success" role="status">Thanks for writing! Your message has been sent.</p>}
    {status === "draft" && <p className="contact-status" role="status">Your email app should open with a draft. Please send it from there to finish. If it didn&apos;t open, email us at <a href={`mailto:${email}`}>{email}</a>.</p>}
  </form>;
}
