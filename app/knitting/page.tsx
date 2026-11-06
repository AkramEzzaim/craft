import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
import { listPatterns } from "@/lib/patterns";

export function generateMetadata(): Metadata {
  const hasPublishedPatterns = listPatterns(false).some((pattern) => pattern.category === "knitting");
  return {
    title: "Knitting Patterns",
    description: "Easy knitting projects with soft textures and everyday charm.",
    robots: hasPublishedPatterns ? undefined : { index: false, follow: true },
  };
}

export default function Page() { return <CollectionPage category="knitting" eyebrow="The knitting collection" title="Make something cozy." description="Simple, satisfying projects for slow evenings and well-loved handmade pieces."/>; }
