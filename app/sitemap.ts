import type { MetadataRoute } from "next";
import { fetchLandingData } from "./lib/server-data";
import { absoluteUrl, getSeoImageUrl } from "./lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const data = await fetchLandingData();
  const productRoutes = data.products.map((product) => ({
    url: absoluteUrl(`/detail/${product.id}`),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: [getSeoImageUrl(product.thumbnailUrl)],
  }));

  return [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/product"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...productRoutes,
  ];
}
