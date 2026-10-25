import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
export const metadata: Metadata = { title: "Amigurumi Patterns", description: "Browse the free amigurumi pattern collection from Loop & Bloom Crochet.", alternates: { canonical: "/amigurumi" } };
export default function Page() { return <DiscoveryPage category="amigurumi"/>; }
