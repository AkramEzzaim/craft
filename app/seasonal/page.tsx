import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
export const metadata: Metadata = { title: "Seasonal Crochet Patterns", description: "Free seasonal crochet ideas and small handmade gifts from Loop & Bloom Crochet.", alternates: { canonical: "/seasonal" } };
export default function Page() { return <DiscoveryPage category="seasonal"/>; }
