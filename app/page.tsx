import type { Metadata } from "next";
import HomeContent from "./_content";
import { fetchLandingData, fetchServerSettings } from "./lib/server-data";
import { buildHomeJsonLd, safeJsonLd, siteDescription, siteTitle } from "./lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchServerSettings();

  return {
    title: {
      absolute: settings.metaTitle || siteTitle,
    },
    description: settings.metaDescription || siteDescription,
    alternates: {
      canonical: "/",
    },
  };
}

export default async function Home() {
  const initialData = await fetchLandingData();
  const jsonLd = buildHomeJsonLd(initialData);

  return (
    <>
      <script
        id="home-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <HomeContent initialData={initialData} />
    </>
  );
}
