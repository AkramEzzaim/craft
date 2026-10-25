import type { Pattern } from "@/types/pattern";

export type DiscoveryKey = "beginner" | "granny-squares" | "quick-projects" | "amigurumi" | "home-decor" | "seasonal" | "tips-and-tutorials";

export const discovery: Record<DiscoveryKey, { title: string; intro: string; short: string; color: string }> = {
  beginner: { title: "Beginner Crochet", intro: "A welcoming place to start, with simple stitches and projects you can take one step at a time.", short: "Start with the basics", color: "peach" },
  "granny-squares": { title: "Granny Square Patterns", intro: "Colorful crochet squares and motifs, from the classic first square to fresh ways to use them.", short: "Little squares, big ideas", color: "lavender" },
  "quick-projects": { title: "Quick Crochet Projects", intro: "A small project can make an ordinary afternoon feel special. Find a satisfying make for the time you have.", short: "Make something today", color: "yellow" },
  amigurumi: { title: "Amigurumi Patterns", intro: "Curious about crocheted characters? Explore the projects in this collection as they become available.", short: "Little characters to love", color: "blue" },
  "home-decor": { title: "Crochet for Home & Decor", intro: "Add a handmade touch to your table, shelves, and everyday corners with practical crochet ideas.", short: "A handmade home", color: "sage" },
  seasonal: { title: "Seasonal Crochet", intro: "Thoughtful little crochet projects for gifts, celebrations, and changing seasons.", short: "For each little season", color: "pink" },
  "tips-and-tutorials": { title: "Crochet Tips & Tutorials", intro: "Clear instructions and useful guidance to help you feel at home with every stitch.", short: "Learn as you make", color: "cream" },
};

export function discover(pattern: Pattern, key: DiscoveryKey): boolean {
  if (pattern.category !== "crochet") return false;
  const text = `${pattern.title} ${pattern.description} ${pattern.tags.join(" ")} ${pattern.primaryKeyword || ""}`.toLowerCase();
  switch (key) {
    case "beginner": return pattern.beginnerFriendly || /beginner|easy|first project/.test(text);
    case "granny-squares": return /granny|square|motif/.test(text);
    case "quick-projects": return /quick|flower|heart|coaster|appliqu[eé]/.test(text) || /(?:\d+\s*(?:minute|min|hour))/.test(pattern.estimatedTime || "");
    case "amigurumi": return /amigurumi|plush|stuffed|toy|animal/.test(text);
    case "home-decor": return /coaster|home|decor|table|blanket|pillow|basket/.test(text);
    case "seasonal": return /season|holiday|christmas|autumn|spring|gift|heart|flower/.test(text);
    case "tips-and-tutorials": return /tutorial|tip|guide|learn|how to|stitch/.test(text);
  }
}

export function discoveryPatterns(patterns: Pattern[], key: DiscoveryKey): Pattern[] {
  return patterns.filter((pattern) => discover(pattern, key));
}
