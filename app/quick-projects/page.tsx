import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
export const metadata: Metadata = { title: "Quick Crochet Projects", description: "Find small free crochet projects you can enjoy in an afternoon with Loop & Bloom Crochet.", alternates: { canonical: "/quick-projects" } };
export default function Page() { return <DiscoveryPage category="quick-projects"/>; }
