# Loop & Bloom Crochet

A responsive craft-content site built with Next.js App Router, TypeScript, Tailwind CSS, and local Markdown articles. It is designed for Vercel and keeps the subscriber workflow behind a server-side API route.

## Local development

1. Use Node.js 20.9 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` and set the values you have.
4. Run `npm run dev` and open `http://localhost:3000`.
5. Run `npm run check:content`, `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.

The eight included articles are **drafts**, shown only during local development for editorial review. Production always filters out drafts, even if `ENABLE_DRAFT_PREVIEW=true` is set. Review the project instructions, stitch counts, materials, and images, then change `status: "draft"` to `status: "published"` in each approved Markdown file. No generated tutorial should be published without human review. See [docs/crochet-editorial-review.md](docs/crochet-editorial-review.md) for the five new crochet demos.

## Content

Articles live in `content/patterns/*.md`. Frontmatter uses one `key: value` per line, with comma-separated `tags`. Supported fields are `title`, `slug`, `description`, `category`, `difficulty`, `estimatedTime`, `featuredImage`, `imageAlt`, `publishedAt`, `updatedAt`, `status`, `featured`, `trending`, `beginnerFriendly`, `tags`, `author`, `seoTitle`, `metaDescription`, `canonicalUrl`, `pinterestImage`, and `patternDownloadUrl`. The Markdown body supports paragraphs, level 2 and 3 headings, unordered and ordered lists, and bold text. This deliberately small format keeps content portable and safe to render. For richer MDX later, replace only the parser and article renderer.

Use `patternDownloadUrl` for a public, same-site URL to a reviewed pattern PDF or instruction section. The API verifies that it is a local path before returning it. Files in `/public` are public, so the URL is an access convenience after signup, not a secure paywall.

## Lead flow

The browser sends the form to `POST /api/subscribe`. The route validates the name, email, consent, and known pattern; checks a honeypot, origin, request size, and a basic short-term per-IP limit; then forwards a limited payload to n8n with an eight-second timeout. It returns the pattern URL only after n8n responds successfully. No Google credentials or webhook URL reach the browser. See [docs/n8n-setup.md](docs/n8n-setup.md) for the complete sheet and workflow configuration.

The in-memory limit is a basic spam barrier. Serverless instances do not share memory. Add a durable edge rate limiter and bot protection if abuse appears. Do not send marketing email until an unsubscribe mechanism and applicable consent process are configured.

## Deployment

1. Create a private GitHub repository and push this project.
2. Import that repository into Vercel as a Next.js project.
3. Set `NEXT_PUBLIC_SITE_URL` to the final `https://` domain, `NEXT_PUBLIC_CONTACT_EMAIL` to a monitored inbox, and `N8N_LEAD_WEBHOOK_URL` to the production n8n webhook. Set `N8N_LEAD_WEBHOOK_SECRET` if you enable bearer authentication in n8n. Leave `ENABLE_DRAFT_PREVIEW` unset in production.
4. Complete and test the n8n workflow and Google Sheets described in `docs/n8n-setup.md`.
5. Review and publish each article. Check the privacy policy and terms for the final business identity and region. Add analytics, Pinterest verification, and AdSense only after their setup and policy requirements have been reviewed.

The project has no database and no automatic content publishing. `sitemap.xml` includes only published patterns. `robots.txt` excludes search and API routes. Draft article URLs return 404 in production.

## Assets

The craft photographs in `public/images` were generated for this project with the built-in ImageGen tool. They are illustrative editorial images. Replace any picture that does not accurately show the final reviewed pattern.
