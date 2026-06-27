import type { Metadata } from "next";
import { siteName } from "../lib/seo";
import AboutContent from "./_content";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: `Kenali ${siteName}—studio pengembang yang fokus pada CMS dan produk digital yang mudah dikelola sendiri.`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
