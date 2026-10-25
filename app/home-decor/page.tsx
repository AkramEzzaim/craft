import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
export const metadata: Metadata = { title: "Crochet for Home & Decor", description: "Free crochet patterns for a handmade home, from practical coasters to colorful accents.", alternates: { canonical: "/home-decor" } };
export default function Page() { return <DiscoveryPage category="home-decor"/>; }
