import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
export const metadata: Metadata = { title: "DIY Craft Tutorials", description: "Thoughtful DIY craft tutorials and handmade project ideas." };
export default function Page() { return <CollectionPage category="diy" eyebrow="The DIY collection" title="Little projects, lovely results." description="Gather a few materials and turn an ordinary afternoon into something memorable."/>; }
