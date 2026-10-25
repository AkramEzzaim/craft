import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
export const metadata: Metadata = { title: "Crochet Tips & Tutorials", description: "Clear crochet instructions and practical tips for your next project from Loop & Bloom Crochet.", alternates: { canonical: "/tips-and-tutorials" } };
export default function Page() { return <DiscoveryPage category="tips-and-tutorials"/>; }
