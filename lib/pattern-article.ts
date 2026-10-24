import type { Pattern } from "@/types/pattern";

export type ArticleVariation = { title: string; description: string };
export type ArticleMistake = { title: string; explanation: string; fix?: string };
export type ArticleRound = { title: string; label: string; pattern: string; steps: string[]; stitchCount?: string; tip?: string; image?: string; imageAlt?: string };
export type ArticlePhoto = { src: string; alt: string };
export type ArticleFaq = { question: string; answer: string };
export type ArticleAbbreviation = { code: string; meaning: string };
export type CrochetArticle = {
  about: string[];
  variations: ArticleVariation[];
  mistakes: ArticleMistake[];
  materials: string[];
  tools: string[];
  abbreviations: ArticleAbbreviation[];
  introduction: string[];
  rounds: ArticleRound[];
  notes: string[];
  gallery: ArticlePhoto[];
  faq: ArticleFaq[];
  details: string[];
  yarn?: string;
  hook?: string;
  extraSections: { title: string; body: string }[];
  fallbackBody?: string;
};

type Section = { title: string; body: string };

function record(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
}

function string(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function strings(value: unknown): string[] {
  if (typeof value === "string") return string(value) ? [value.trim()] : [];
  return Array.isArray(value) ? value.map(string).filter((item): item is string => !!item) : [];
}

function lines(body = ""): string[] {
  return body.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

function bullets(body = ""): string[] {
  return lines(body).filter((line) => /^[-*] /.test(line)).map((line) => line.slice(2).trim());
}

function paragraphs(body = ""): string[] {
  return body.split(/\n\s*\n/).map((part) => part.trim().replace(/\s*\n\s*/g, " ")).filter((part) => part && !/^(?:[-*] |### )/.test(part));
}

function sections(body: string): { preamble: string; sections: Section[] } {
  const matches = [...body.matchAll(/^## (.+)$/gm)];
  if (!matches.length) return { preamble: body.trim(), sections: [] };
  return {
    preamble: body.slice(0, matches[0].index).trim(),
    sections: matches.map((match, index) => ({
      title: match[1].trim(),
      body: body.slice(match.index! + match[0].length, matches[index + 1]?.index ?? body.length).trim(),
    })),
  };
}

function subsections(body = ""): { intro: string; items: Section[] } {
  const matches = [...body.matchAll(/^### (.+)$/gm)];
  if (!matches.length) return { intro: body.trim(), items: [] };
  return {
    intro: body.slice(0, matches[0].index).trim(),
    items: matches.map((match, index) => ({
      title: match[1].trim(),
      body: body.slice(match.index! + match[0].length, matches[index + 1]?.index ?? body.length).trim(),
    })),
  };
}

function unique(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function shortTitle(sentence: string, fallback: string): string {
  const subject = sentence.split(/\b(?:can|may|will|leaves|makes|changes|causes|often|is|are)\b/i)[0].trim();
  return subject.length >= 8 && subject.length <= 75 ? subject : fallback;
}

function mistakeFromBullet(item: string, index: number): ArticleMistake {
  const split = item.match(/^(.+?\.)\s+(.+)$/);
  const explanation = split?.[1] || item;
  return { title: shortTitle(explanation.replace(/\.$/, ""), `Common mistake ${index + 1}`), explanation, fix: split?.[2] };
}

function localImage(value: unknown): string | undefined {
  const src = string(value);
  return src?.startsWith("/") && !src.startsWith("//") ? src : undefined;
}

export function normalizeCrochetArticle(pattern: Pattern): CrochetArticle {
  const { preamble, sections: parsed } = sections(pattern.body);
  const byTitle = new Map(parsed.map((section) => [section.title.toLowerCase(), section.body]));
  const structured = record(pattern.articleData) || {};
  const section = (...names: string[]) => names.map((name) => byTitle.get(name)).find(Boolean) || "";
  const about = unique([...strings(structured.about), ...paragraphs(section("about this pattern", "about")), ...(parsed.length ? paragraphs(preamble) : [])]);
  const details = bullets(section("project information", "project details", "at a glance"));
  const materials = unique([...strings(structured.materials), ...bullets(section("materials"))]);
  const tools = unique([...strings(structured.tools), ...bullets(section("tools"))]);
  const yarnDetail = details.find((item) => /^yarn(?: weight)?:/i.test(item));
  const hookDetail = details.find((item) => /^hook(?: size)?:/i.test(item));
  const yarn = pattern.yarn || string(structured.yarn) || yarnDetail?.replace(/^yarn(?: weight)?:\s*/i, "") || materials.find((item) => /\byarn\b/i.test(item));
  const hook = pattern.hook || string(structured.hook) || hookDetail?.replace(/^hook(?: size)?:\s*/i, "") || tools.find((item) => /\bhook\b/i.test(item));

  const abbreviationItems = Array.isArray(structured.abbreviations)
    ? structured.abbreviations.flatMap((value) => {
      const item = record(value);
      const code = string(item?.code); const meaning = string(item?.meaning);
      return code && meaning ? [{ code, meaning }] : [];
    })
    : Object.entries(record(structured.abbreviations) || {}).flatMap(([code, meaning]) => string(meaning) ? [{ code, meaning: string(meaning)! }] : []);
  const abbreviationText = [section("abbreviations"), ...details.filter((item) => /^abbreviations?:/i.test(item)).map((item) => item.replace(/^abbreviations?:/i, ""))].join(", ");
  const abbreviations = abbreviationItems.length ? abbreviationItems : abbreviationText.split(/[,\n]/).flatMap((part) => {
    const match = part.trim().replace(/^[-*]\s*/, "").match(/^(.+?)\s*(?:=|:|—)\s*(.+)$/);
    return match ? [{ code: match[1].trim(), meaning: match[2].trim() }] : [];
  });

  const variationData = Array.isArray(structured.variations) ? structured.variations : [];
  const variationSection = subsections(section("variations"));
  const variations = variationData.length ? variationData.flatMap((value, index) => {
    if (typeof value === "string") return [{ title: `Variation ${index + 1}`, description: value }];
    const item = record(value); const description = string(item?.description);
    return description ? [{ title: string(item?.title) || `Variation ${index + 1}`, description }] : [];
  }) : variationSection.items.length
    ? variationSection.items.map((item) => ({ title: item.title, description: paragraphs(item.body).join(" ") || item.body }))
    : bullets(variationSection.intro).map((description, index) => ({ title: `Variation ${index + 1}`, description }));

  const mistakeData = Array.isArray(structured.mistakes) ? structured.mistakes : [];
  const mistakeSection = subsections(section("common mistakes", "troubleshooting"));
  const mistakes = mistakeData.length ? mistakeData.flatMap((value, index) => {
    if (typeof value === "string") return [mistakeFromBullet(value, index)];
    const item = record(value); const explanation = string(item?.explanation);
    return explanation ? [{ title: string(item?.title) || `Common mistake ${index + 1}`, explanation, fix: string(item?.fix) }] : [];
  }) : mistakeSection.items.length ? mistakeSection.items.map((item, index) => {
    const description = paragraphs(item.body).join(" ") || item.body;
    const parsed = mistakeFromBullet(description, index);
    return { ...parsed, title: item.title };
  }) : bullets(mistakeSection.intro).map(mistakeFromBullet);

  const instructionSection = subsections(section("main pattern", "instructions", "pattern"));
  const roundData = Array.isArray(structured.rounds) ? structured.rounds : [];
  const rounds = roundData.length ? roundData.flatMap((value, index) => {
    const item = record(value); if (!item) return [];
    const patternText = string(item.pattern) || "";
    const steps = strings(item.steps);
    if (!patternText && !steps.length) return [];
    const title = string(item.title) || `Round ${index + 1}`;
    return [{ title, label: string(item.label) || `ROUND ${index + 1}`, pattern: patternText, steps, stitchCount: string(item.stitchCount), tip: string(item.tip), image: localImage(item.image), imageAlt: string(item.imageAlt) }];
  }) : instructionSection.items.map((item, index) => {
    const roundMatch = item.title.match(/\bround\s+(\d+|one|two|three|four|five|six)\b/i);
    const numberWords: Record<string, string> = { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6" };
    const number = roundMatch?.[1].toLowerCase();
    return { title: item.title.replace(/^\d+\.\s*/, ""), label: roundMatch ? `ROUND ${numberWords[number!] || number}` : `STEP ${index + 1}`, pattern: paragraphs(item.body).join(" ") || item.body, steps: [] };
  });

  const notes = unique([...strings(structured.notes), ...bullets(section("important notes", "notes", "beginner tips", "tips"))]);
  const galleryData = Array.isArray(structured.gallery) ? structured.gallery : [];
  const gallery = galleryData.flatMap((value) => {
    const item = record(value); const src = localImage(item?.src || item?.image);
    return src ? [{ src, alt: string(item?.alt) || `${pattern.title} project detail` }] : [];
  });
  if (!gallery.length) for (const match of section("more photos", "gallery").matchAll(/!\[([^\]]*)\]\((\/[^)]+)\)/g)) {
    const src = localImage(match[2]);
    if (src) gallery.push({ src, alt: match[1].trim() || `${pattern.title} project detail` });
  }
  const faqData = Array.isArray(structured.faq) ? structured.faq : [];
  const faq = faqData.length ? faqData.flatMap((value) => {
    const item = record(value); const question = string(item?.question); const answer = string(item?.answer);
    return question && answer ? [{ question, answer }] : [];
  }) : subsections(section("faq", "frequently asked questions")).items.map((item) => ({ question: item.title, answer: paragraphs(item.body).join(" ") || item.body }));

  const known = new Set(["about this pattern", "about", "project information", "project details", "at a glance", "materials", "tools", "abbreviations", "variations", "common mistakes", "troubleshooting", "main pattern", "instructions", "pattern", "important notes", "notes", "beginner tips", "tips", "more photos", "gallery", "faq", "frequently asked questions"]);
  const extraSections = parsed.filter((item) => !known.has(item.title.toLowerCase()));
  const fallbackBody = !parsed.length && !rounds.length ? pattern.body : undefined;
  return { about, variations, mistakes, materials, tools, abbreviations, introduction: unique([...paragraphs(instructionSection.intro), ...strings(structured.mainPatternIntro)]), rounds, notes, gallery, faq, details, yarn, hook, extraSections, fallbackBody };
}
