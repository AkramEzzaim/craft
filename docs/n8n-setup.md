# n8n and Google Sheets setup

The website never connects to Google Sheets directly. An n8n webhook receives validated leads from the Next.js server and writes them to a sheet.

## 1. Create a Google spreadsheet

Create these tabs with exactly these header rows:

**Subscribers**

`id | name | email | pattern_id | pattern_title | source_url | utm_source | utm_medium | utm_campaign | status | created_at`

**ContentQueue**

`id | keyword | category | search_intent | working_title | priority | status | notes | created_at | generated_at | published_at | slug | article_url`

**PublishedArticles**

`id | keyword | title | slug | category | url | published_at | updated_at | status`

Share the spreadsheet with the Google account used by n8n. Keep it private. The content tabs are for editorial tracking; publishing happens through reviewed Markdown commits, not by changing a sheet status alone.

## 2. Create the lead workflow in n8n

Build these nodes in order:

1. **Webhook:** POST, production path such as `craft-leads`, response mode **Respond to Webhook**. Keep the production URL private. Configure bearer or header authentication where your n8n installation supports it. Set the same secret as `N8N_LEAD_WEBHOOK_SECRET` in Vercel. The Next.js route sends `Authorization: Bearer <secret>` when configured.
2. **Validation / Set:** Accept only the expected fields and ensure `email`, `name`, `pattern_id`, and `submitted_at` are present. The site validates first; this is a second check at the workflow boundary.
3. **Google Sheets lookup:** Search `Subscribers` for the normalized email and `pattern_id` combination. This avoids adding the same subscriber for the same pattern repeatedly.
4. **IF:** If a row exists, keep it; otherwise append a row to `Subscribers`. Generate `id` with a UUID in n8n and set `status` to `subscribed` only if your consent and email process permits it. For a future double opt-in flow, set `pending` and send verification first. Map `created_at` from `submitted_at`.
5. **Respond to Webhook:** Return HTTP 200 JSON, for example `{ "ok": true }`, only after the sheet write or duplicate check succeeds. Return an error status if Google Sheets fails. The website will withhold the pattern link on an error.

Do not log full lead payloads in publicly accessible execution logs. Restrict access to the workflow and spreadsheet. Review n8n execution retention and Google sharing settings.

## 3. Connect the site

Set these environment variables in Vercel:

```text
N8N_LEAD_WEBHOOK_URL=https://your-n8n-host.example/webhook/craft-leads
N8N_LEAD_WEBHOOK_SECRET=your-shared-secret
NEXT_PUBLIC_SITE_URL=https://your-site.example
NEXT_PUBLIC_CONTACT_EMAIL=hello@your-site.example
```

Use the production webhook URL, not the test URL. Add the same variables to `.env.local` for local testing, using a test webhook if desired. Never commit `.env.local` or use `NEXT_PUBLIC_` for the webhook or secret.

## 4. Test before launch

- Submit a valid name, email, and consent from a reviewed, published article. Confirm one row appears with the correct pattern and UTM values, then confirm the pattern access link appears.
- Submit the same email/pattern again and confirm the workflow does not create a duplicate row.
- Submit without consent and with an invalid email; confirm no sheet row is created.
- Temporarily disable the n8n workflow and confirm the site shows a safe retry message, with no false success.
- Test a mobile browser, keyboard navigation, Escape key, and privacy-policy link in the signup modal.

## Future double opt-in

Change the n8n flow to write `pending`, send a one-time verification email, and change status to `subscribed` only after confirmation. The site can keep the same `/api/subscribe` contract; it may need to change when it grants pattern access based on your chosen consent model.
