import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "akramtkd41@gmail.com";

  return <>
    <section className="collection-hero contact-hero">
      <div className="container-wide">
        <span className="eyebrow">Get in touch</span>
        <h1>We&apos;d love to hear from you.</h1>
        <p>Questions about a project, a correction, or a lovely thing you made? Send us a note.</p>
      </div>
    </section>
    <section className="contact-section container-wide" aria-labelledby="contact-heading">
      <div className="contact-intro">
        <span className="eyebrow">A note to us</span>
        <h2 id="contact-heading">Say hello</h2>
        <p>Fill in the form and tell us what&apos;s on your mind. For pattern corrections, include the pattern name and the step you&apos;re asking about.</p>
        <p className="contact-email-note">You can also write to <a href={`mailto:${email}`}>{email}</a>.</p>
      </div>
      <ContactForm email={email} deliveryConfigured={Boolean(process.env.N8N_CONTACT_WEBHOOK_URL)} />
    </section>
  </>;
}
