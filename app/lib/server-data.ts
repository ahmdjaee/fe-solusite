import {
  normalizeDiscount,
  normalizePlan,
  normalizePortfolioItem,
  normalizeProduct,
  normalizeService,
} from "./data";
import type { Discount, Plan, PortfolioItem, Product, Service } from "./data";

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
  services: Service[];
  portfolio: PortfolioItem[];
  plans: Plan[];
  discounts: Discount[];
};

export async function fetchLandingData(): Promise<LandingData> {
  const [products, services, portfolio, plans, discounts] = await Promise.all([
    fetchServerCollection("products", normalizeProduct),
    fetchServerCollection("services", normalizeService),
    fetchServerCollection("portfolio", normalizePortfolioItem),
    fetchServerCollection("plans", normalizePlan),
    fetchServerCollection("discounts", normalizeDiscount),
  ]);

  return {
    products,
    services,
    portfolio,
    plans,
    discounts,
  };
}

export async function fetchServerProductById(id: number): Promise<Product | null> {
  const json = (await fetchLaravel(`/products/${id}`)) as LaravelResource | null;

  if (json?.data) return normalizeProduct(json.data);

  return null;
}
