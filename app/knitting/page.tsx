import type { Metadata } from "next";
import { CollectionPage } from "@/components/collection-page";
export const metadata: Metadata = { title: "Knitting Patterns", description: "Easy knitting projects with soft textures and everyday charm." };
export default function Page() { return <CollectionPage category="knitting" eyebrow="The knitting collection" title="Make something cozy." description="Simple, satisfying projects for slow evenings and well-loved handmade pieces."/>; }
