import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
export const metadata: Metadata = { title: "Crochet Patterns", description: "Free crochet projects, from small gifts to cozy home accents." };
export default function Page() { return <CollectionPage category="crochet" eyebrow="The crochet collection" title="Crochet something lovely." description="Small projects, playful details, and the pleasure of making each stitch your own."/>; }
