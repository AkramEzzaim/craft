import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
export const metadata: Metadata = { title: "Beginner Crochet Patterns", description: "Explore beginner-friendly free crochet patterns and clear tutorials from Loop & Bloom Crochet.", alternates: { canonical: "/beginner" } };
export default function Page() { return <DiscoveryPage category="beginner"/>; }
