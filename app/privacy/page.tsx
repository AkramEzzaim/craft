import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Page() {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

  return <>
    <section className="collection-hero"><div className="container-wide"><span className="eyebrow">Your information</span><h1>Privacy Policy</h1><p>How we handle information shared with Loop &amp; Bloom Crochet.</p></div></section>
    <div className="info-page container-wide legal-copy">
      <p>Last updated: October 25, 2026. This policy describes the current website setup and should be reviewed when the site&apos;s providers or advertising settings change.</p>
      <h2>Information we collect</h2>
      <p>When you request a free pattern, we collect your name, email address, the pattern requested, the page where you signed up, and campaign information in the URL. We also record the time of your request. We only process a signup when you check the consent box.</p>
      <p>When you use the contact form, we use your name, email address, subject, and message to respond. Depending on the delivery setup, your message is sent through your email app or a private n8n workflow.</p>
      <h2>How we use it</h2>
      <p>We use these details to provide access to the pattern and send occasional craft emails you asked for. Our site sends the signup to a private n8n workflow, which stores it in Google Sheets. We do not sell subscriber data.</p>
      <h2>Retention and your choices</h2>
      <p>You can request access, correction, or deletion of your information and unsubscribe from emails at any time. The site owner must configure an unsubscribe process in the email system before sending marketing messages.</p>
      <h2>Cookies and advertising</h2>
      <p>Google AdSense code runs on public pages for site verification and potential advertising. Third-party vendors, including Google, may use cookies to serve ads based on visits to this site or other websites. Google and its partners may use advertising cookies to personalize ads. You can manage personalized advertising in <a href="https://myadcenter.google.com/">Google My Ad Center</a>. No manual ad placements have been added.</p>
      <h2>Contact</h2>
      <p>{email ? <>For privacy requests, email <a href={`mailto:${email}`}>{email}</a>.</> : <>Contact details will be added before public launch.</>}</p>
    </div>
  </>;
}
