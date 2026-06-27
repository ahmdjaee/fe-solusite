import type { Metadata } from "next";
import { fetchLandingData } from "../lib/server-data";
import { siteName } from "../lib/seo";
import ProductListContent from "./_content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Semua Produk",
  description: `Telusuri semua produk digital ${siteName} berdasarkan kategori.`,
  alternates: {
    canonical: "/product",
  },
};

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await searchParams;
  const initialCategory = typeof category === "string" ? category : "all";

  const { products, discounts, categories } = await fetchLandingData();

  return (
    <ProductListContent
      initialProducts={products}
      initialDiscounts={discounts}
      initialCategories={categories}
      initialCategory={initialCategory}
    />
  );
}
