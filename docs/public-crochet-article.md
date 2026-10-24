# Public crochet article layout

The public `/patterns/[slug]` route uses the dedicated crochet layout when a pattern has `category: "crochet"`. Knitting and DIY articles keep their existing layout. Draft visibility, metadata, canonical URLs, structured data, and sitemap behavior stay unchanged.

The layout reads the existing Markdown headings: `Project Details` or `At a glance`, `Materials`, `Tools`, `Instructions` (with `###` steps), `Beginner Tips` or `Tips`, `Common mistakes`, and `FAQ` (with `###` questions). Optional `Variations`, `Abbreviations`, and `More Photos` sections are supported. Images in `More Photos` use Markdown image syntax and must point to local `/public` assets. Unknown sections remain visible under their own headings. Sections with no data are omitted.

Optional single-line frontmatter fields include `yarn`, `hook`, `about`, `variations`, `mistakes`, `materials`, `tools`, `abbreviations`, `rounds`, `mainPatternIntro`, `notes`, `gallery`, and `faq`. Lists and objects can be supplied as JSON on one line. The same keys can be grouped in a JSON `articleData` field. Structured values take precedence over the corresponding Markdown sections; the existing Markdown remains a fallback for older articles. Photo and round image paths must be local paths beginning with `/`.

The newsletter form on crochet articles uses the existing `/api/subscribe` endpoint with the current pattern ID and explicit email consent. It only reports success after that endpoint succeeds. The share CTA links to the existing contact page; a community upload flow is not present in this repository.
