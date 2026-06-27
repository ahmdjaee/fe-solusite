import { normalizeCategory, normalizeDiscount, normalizeProduct } from "./data";
import type { Category, Discount, Product } from "./data";
import {
  findMockProduct,
  mockCategories,
  mockDiscounts,
  mockProducts,
} from "./mock-data";

const DEFAULT_API_BASE_URL = "http://localhost:8000/api";

type LaravelResource = {
  data?: unknown;
};

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

async function fetchLaravel(path: string) {
  try {
    const response = await fetch(`${getApiBaseUrl()}${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;

    return response.json();
  } catch {
    return null;
  }
}

async function fetchServerCollection<T>(
  path: string,
  normalize: (value: unknown) => T,
): Promise<T[]> {
  const json = (await fetchLaravel(`/${path}`)) as { data?: unknown[] } | null;

  if (!json?.data || !Array.isArray(json.data)) return [];

  return json.data.map(normalize);
}

export type LandingData = {
  products: Product[];
  categories: Category[];
  discounts: Discount[];
};

export async function fetchLandingData(): Promise<LandingData> {
  const [products, categories, discounts] = await Promise.all([
    fetchServerCollection("products", normalizeProduct),
    fetchServerCollection("categories", normalizeCategory),
    fetchServerCollection("discounts", normalizeDiscount),
  ]);

  return {
    // Fallback ke data dummy bila API belum mengembalikan data.
    products: products.length > 0 ? products : mockProducts,
    categories: categories.length > 0 ? categories : mockCategories,
    discounts: discounts.length > 0 ? discounts : mockDiscounts,
  };
}

export async function fetchServerProductById(id: number): Promise<Product | null> {
  const json = (await fetchLaravel(`/products/${id}`)) as LaravelResource | null;

  if (json?.data) return normalizeProduct(json.data);

  // Fallback ke produk dummy bila API belum tersedia.
  return findMockProduct(id);
}
