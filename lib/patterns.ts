import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Category, Pattern } from "@/types/pattern";

const directory = path.join(process.cwd(), "content", "patterns");
const categorySet = new Set(["crochet", "knitting", "diy"]);

function scalar(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function optionalJson(value?: string): unknown {
  if (!value) return undefined;
  try { return JSON.parse(value); } catch { return value; }
}

function readPattern(file: string): Pattern {
  const raw = fs.readFileSync(path.join(directory, file), "utf8");
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`Missing frontmatter in ${file}`);
  const data: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const colon = line.indexOf(":");
    if (colon < 1) throw new Error(`Invalid frontmatter in ${file}`);
    data[line.slice(0, colon).trim()] = scalar(line.slice(colon + 1));
  }
  const required = ["title", "slug", "description", "category", "difficulty", "featuredImage", "publishedAt", "status", "author"];
  for (const key of required) if (!data[key]) throw new Error(`Missing ${key} in ${file}`);
  if (!categorySet.has(data.category)) throw new Error(`Invalid category in ${file}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) throw new Error(`Invalid slug in ${file}`);
  if (!/^(draft|published)$/.test(data.status)) throw new Error(`Invalid status in ${file}`);
  const structuredKeys = ["about", "variations", "mistakes", "materials", "tools", "abbreviations", "rounds", "mainPatternIntro", "notes", "gallery", "faq"];
  const structuredFields = Object.fromEntries(structuredKeys.filter((key) => data[key]).map((key) => [key, optionalJson(data[key])]));
  const articleData = optionalJson(data.articleData);
  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    subtitle: data.subtitle,
    category: data.category as Category,
    difficulty: data.difficulty,
    estimatedTime: data.estimatedTime,
    featuredImage: data.featuredImage,
    imageAlt: data.imageAlt,
    publishedAt: data.publishedAt,
    updatedAt: data.updatedAt,
    status: data.status as Pattern["status"],
    featured: data.featured === "true",
    trending: data.trending === "true",
    beginnerFriendly: data.beginnerFriendly === "true",
    tags: data.tags ? data.tags.split(",").map((tag) => tag.trim()).filter(Boolean) : [],
    primaryKeyword: data.primaryKeyword,
    author: data.author,
    seoTitle: data.seoTitle,
    metaDescription: data.metaDescription,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
    pinterestTitle: data.pinterestTitle,
    pinterestDescription: data.pinterestDescription,
    canonicalUrl: data.canonicalUrl,
    pinterestImage: data.pinterestImage,
    patternDownloadUrl: data.patternDownloadUrl,
    relatedSlugs: data.relatedPatterns ? data.relatedPatterns.split(",").map(value => value.trim()).filter(value => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) : [],
    yarn: data.yarn,
    hook: data.hook,
    articleData: { ...structuredFields, ...(articleData && typeof articleData === "object" && !Array.isArray(articleData) ? articleData : {}) },
    body: match[2].trim(),
  };
}

export function isDraftPreview(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.ENABLE_DRAFT_PREVIEW !== "false";
}

export function listPatterns(includeDrafts = isDraftPreview()): Pattern[] {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .map(readPattern)
    .filter((pattern) => includeDrafts || pattern.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPattern(slug: string, includeDrafts = isDraftPreview()): Pattern | undefined {
  return listPatterns(includeDrafts).find((pattern) => pattern.slug === slug);
}

export function byCategory(category: Category): Pattern[] {
  return listPatterns().filter((pattern) => pattern.category === category);
}

export function featuredPatterns(): Pattern[] {
  return listPatterns().filter((pattern) => pattern.featured);
}

export function relatedPatterns(pattern: Pattern, limit = 3): Pattern[] {
  return listPatterns().filter((item) => item.slug !== pattern.slug)
    .sort((a, b) => {
      const rank = (item: Pattern) => (pattern.relatedSlugs?.includes(item.slug) ? 100 : 0) + (item.category === pattern.category ? 10 : 0) + item.tags.filter(tag => pattern.tags.includes(tag)).length * 2 + (pattern.primaryKeyword && `${item.title} ${item.description}`.toLowerCase().includes(pattern.primaryKeyword.toLowerCase()) ? 3 : 0);
      return rank(b) - rank(a);
    })
    .slice(0, limit);
}

export function patternUrl(pattern: Pick<Pattern, "slug">): string {
  return `/patterns/${pattern.slug}`;
}

export function searchPatterns(query: string): Pattern[] {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return listPatterns().filter((pattern) => {
    const haystack = `${pattern.title} ${pattern.description} ${pattern.category} ${pattern.difficulty} ${pattern.tags.join(" ")}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}
