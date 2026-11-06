import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { listPatterns } from "@/lib/patterns";

export function generateMetadata(): Metadata {
  const hasPublishedPatterns = listPatterns(false).some((pattern) => pattern.category === "diy");
  return {
    title: "DIY Craft Tutorials",
    description: "Thoughtful DIY craft tutorials and handmade project ideas.",
    robots: hasPublishedPatterns ? undefined : { index: false, follow: true },
  };
}

export default function Page() { return <CollectionPage category="diy" eyebrow="The DIY collection" title="Little projects, lovely results." description="Gather a few materials and turn an ordinary afternoon into something memorable."/>; }
