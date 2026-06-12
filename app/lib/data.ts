export type Product = {
  id: number;
  name: string;
  short: string;
  description: string;
  price: number;
  label: string;
  status: string;
  type: "app" | "source-code";
  availability: "ready" | "custom";
  tags: string[];
  thumbnail: string;
  thumbnailUrl: string;
  discountAmount?: number;
  finalPrice?: number;
};

export type DiscountType = "percentage" | "fixed";

export type Discount = {
  id: number;
  productId: number;
  name: string;
  code: string;
  type: DiscountType;
  value: number;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
  currentlyActive?: boolean;
};

export type DiscountPayload = {
  product_id: number;
  name: string;
  code: string;
  type: DiscountType;
  value: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
};

export type ProductPricing = {
  originalPrice: number;
  finalPrice: number;
  savings: number;
  discount: Discount | null;
};

type MaybeRecord = Record<string, unknown>;

const DEFAULT_API_BASE_URL = "http://localhost:8000/api";

function getPublicApiBaseUrl() {
  return process.env.NEXT_PUBLIC_LARAVEL_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export type Service = {
  id: number;
  name: string;
  description: string;
  level: string;
  price: number;
  availability: "custom" | "ready";
  features: string[];
};

export type PortfolioItem = {
  id: number;
  name: string;
  description: string;
  stack: string[];
};

export type Plan = {
  id: number;
  name: string;
  description: string;
  price: number;
  highlight: boolean;
  features: string[];
};

export function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function normalizeDate(value: string, edge: "start" | "end") {
  const suffix = edge === "start" ? "T00:00:00" : "T23:59:59";
  return new Date(`${value}${suffix}`);
}

export function isDiscountActive(discount: Discount, now = new Date()) {
  const startsAt = normalizeDate(discount.startsAt, "start");
  const endsAt = normalizeDate(discount.endsAt, "end");

  return discount.isActive && startsAt <= now && now <= endsAt;
}

export function getProductDiscount(
  productId: number,
  allDiscounts: Discount[] = [],
  now = new Date(),
) {
  return allDiscounts.find((discount) => discount.productId === productId && isDiscountActive(discount, now)) ?? null;
}

export function calculateDiscountedPrice(price: number, discount: Discount | null) {
  if (!discount) return price;

  const discountValue =
    discount.type === "percentage" ? Math.round(price * (discount.value / 100)) : discount.value;

  return Math.max(0, price - discountValue);
}

export function getProductPricing(
  product: Product,
  allDiscounts: Discount[] = [],
  now = new Date(),
): ProductPricing {
  const discount = getProductDiscount(product.id, allDiscounts, now);
  const apiFinalPrice =
    typeof product.finalPrice === "number" && product.finalPrice >= 0 ? product.finalPrice : null;
  const finalPrice =
    apiFinalPrice !== null && apiFinalPrice <= product.price
      ? apiFinalPrice
      : calculateDiscountedPrice(product.price, discount);

  return {
    originalPrice: product.price,
    finalPrice,
    savings:
      typeof product.discountAmount === "number"
        ? product.discountAmount
        : product.price - finalPrice,
    discount,
  };
}

export function toDiscountPayload(discount: Discount): DiscountPayload {
  return {
    product_id: discount.productId,
    name: discount.name,
    code: discount.code,
    type: discount.type,
    value: discount.value,
    starts_at: discount.startsAt,
    ends_at: discount.endsAt,
    is_active: discount.isActive,
  };
}

export function filterProducts(
  items: Product[],
  search: string,
  category: string,
  availability: string,
) {
  const keyword = search.trim().toLowerCase();
  return items.filter((item) => {
    const matchSearch =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword) ||
      item.short.toLowerCase().includes(keyword);
    const matchCategory = category === "all" || item.type === category;
    const matchType = availability === "all" || item.availability === availability;
    return matchSearch && matchCategory && matchType;
  });
}

export function filterServices(
  items: Service[],
  search: string,
  category: string,
  availability: string,
) {
  const keyword = search.trim().toLowerCase();
  return items.filter((item) => {
    const matchSearch =
      !keyword ||
      item.name.toLowerCase().includes(keyword) ||
      item.description.toLowerCase().includes(keyword);
    const matchCategory = category === "all" || category === "service";
    const matchType = availability === "all" || item.availability === availability;
    return matchSearch && matchCategory && matchType;
  });
}

function toRecord(value: unknown): MaybeRecord {
  return value && typeof value === "object" ? (value as MaybeRecord) : {};
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function toBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function toStringArray(value: unknown) {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function unwrapData(value: unknown) {
  if (Array.isArray(value)) return value;

  const record = toRecord(value);
  return Array.isArray(record.data) ? record.data : [];
}

async function fetchPublicCollection<T>(
  path: string,
  normalize: (value: unknown) => T,
) {
  if (typeof window === "undefined") return [];

  const response = await fetch(`${getPublicApiBaseUrl()}/${path}`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Gagal mengambil data ${path}: ${response.status}`);
  }

  const json = await response.json();
  const data = unwrapData(json);

  return data.map(normalize);
}

export function normalizeProduct(value: unknown): Product {
  const item = toRecord(value);

  return {
    id: toNumber(item.id),
    name: toString(item.name),
    short: toString(item.short),
    description: toString(item.description),
    price: toNumber(item.price),
    label: toString(item.label),
    status: toString(item.status),
    type: toString(item.type, "app") as Product["type"],
    availability: toString(item.availability, "ready") as Product["availability"],
    tags: toStringArray(item.tags),
    thumbnail: toString(item.thumbnail),
    thumbnailUrl: toString(item.thumbnail_url) || toString(item.thumbnail),
    discountAmount:
      item.discount_amount === null || item.discount_amount === undefined
        ? undefined
        : toNumber(item.discount_amount),
    finalPrice:
      item.final_price === null || item.final_price === undefined
        ? undefined
        : toNumber(item.final_price),
  };
}

export function normalizeService(value: unknown): Service {
  const item = toRecord(value);

  return {
    id: toNumber(item.id),
    name: toString(item.name),
    description: toString(item.description),
    level: toString(item.level),
    price: toNumber(item.price),
    availability: toString(item.availability, "custom") as Service["availability"],
    features: toStringArray(item.features),
  };
}

export function normalizePortfolioItem(value: unknown): PortfolioItem {
  const item = toRecord(value);

  return {
    id: toNumber(item.id),
    name: toString(item.name),
    description: toString(item.description),
    stack: toStringArray(item.stack),
  };
}

export function normalizePlan(value: unknown): Plan {
  const item = toRecord(value);

  return {
    id: toNumber(item.id),
    name: toString(item.name),
    description: toString(item.description),
    price: toNumber(item.price),
    highlight: toBoolean(item.highlight),
    features: toStringArray(item.features),
  };
}

export function normalizeDiscount(value: unknown): Discount {
  const item = toRecord(value);

  return {
    id: toNumber(item.id),
    productId: toNumber(item.product_id ?? item.productId),
    name: toString(item.name),
    code: toString(item.code),
    type: toString(item.type, "percentage") as DiscountType,
    value: toNumber(item.value),
    startsAt: toString(item.starts_at ?? item.startsAt),
    endsAt: toString(item.ends_at ?? item.endsAt),
    isActive: toBoolean(item.is_active ?? item.isActive),
    currentlyActive:
      item.currently_active === null || item.currently_active === undefined
        ? undefined
        : toBoolean(item.currently_active),
  };
}

export async function fetchProducts() {
  return fetchPublicCollection("products", normalizeProduct);
}

export async function fetchServices() {
  return fetchPublicCollection("services", normalizeService);
}

export async function fetchPortfolio() {
  return fetchPublicCollection("portfolio", normalizePortfolioItem);
}

export async function fetchPlans() {
  return fetchPublicCollection("plans", normalizePlan);
}

export async function fetchDiscounts() {
  return fetchPublicCollection("discounts", normalizeDiscount);
}
