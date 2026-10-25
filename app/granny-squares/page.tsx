import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
export const metadata: Metadata = { title: "Granny Square Patterns", description: "Discover colorful granny square patterns, motifs, and clear crochet instructions from Loop & Bloom Crochet.", alternates: { canonical: "/granny-squares" } };
export default function Page() { return <DiscoveryPage category="granny-squares"/>; }
