import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const directory = path.join(root, "content", "patterns");
const required = ["title", "slug", "description", "category", "difficulty", "featuredImage", "publishedAt", "status", "author"];
const seen = new Set();
let errors = 0;
for (const file of fs.readdirSync(directory).filter((name) => name.endsWith(".md"))) {
  const raw = fs.readFileSync(path.join(directory, file), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) { console.error(`${file}: missing frontmatter`); errors++; continue; }
  const fields = Object.fromEntries(match[1].split(/\r?\n/).filter(Boolean).map((line) => { const index = line.indexOf(":"); return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^['"]|['"]$/g, "")]; }));
  for (const key of required) if (!fields[key]) { console.error(`${file}: missing ${key}`); errors++; }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug || "")) { console.error(`${file}: invalid slug`); errors++; }
  if (seen.has(fields.slug)) { console.error(`${file}: duplicate slug`); errors++; }
  seen.add(fields.slug);
  if (!["crochet", "knitting", "diy"].includes(fields.category)) { console.error(`${file}: invalid category`); errors++; }
  if (!["draft", "published"].includes(fields.status)) { console.error(`${file}: invalid status`); errors++; }
  if (Number.isNaN(Date.parse(fields.publishedAt || ""))) { console.error(`${file}: invalid date`); errors++; }
  if (fields.featuredImage?.startsWith("/") && !fs.existsSync(path.join(root, "public", fields.featuredImage.slice(1)))) { console.error(`${file}: missing image`); errors++; }
  if (!match[2].includes("## Instructions")) { console.error(`${file}: missing Instructions section`); errors++; }
}
if (errors) process.exit(1);
console.log(`Checked ${seen.size} pattern files; all valid.`);
