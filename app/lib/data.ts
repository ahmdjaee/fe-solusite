import { mockCategories, mockDiscounts, mockProducts, mockSettings } from "./mock-data";

export type Product = {
  id: number;
  categoryId?: number;
  name: string;
  short: string;
  description: string;
  price: number;
  label: string;
  status: string;
  type: "app" | "source-code";
  availability: "ready" | "custom";
  category: string;
  tags: string[];
  thumbnail: string;
  thumbnailUrl: string;
  demoUrl?: string;
  staticPrice?: number;
  dynamicPrice?: number;
  discountAmount?: number;
  finalPrice?: number;
  originalPrice?: number;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

export type Settings = {
  siteName: string;
  tagline: string;
  logoUrl: string | null;
  whatsappNumber: string;
  whatsappMessage: string;
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  ogImageUrl: string | null;
  googleAnalyticsId: string;
  googleSiteVerification: string;
};

// Bangun link CTA WhatsApp dari settings (pesan opsional menimpa pesan default).
export function buildWhatsappHref(settings: Settings, message?: string) {
  const text = encodeURIComponent(message ?? settings.whatsappMessage);
  return `https://wa.me/${settings.whatsappNumber}?text=${text}`;
}

export const CMS_CATEGORY = "cms";
export const OTHERS_CATEGORY = "others";

// Harga paket pembelian default (dipakai bila API tidak mengirim static/dynamic_price).
export const STATIC_PRICE = 500000;
export const DYNAMIC_PRICE = 1989000;

// Gambar placeholder (SVG inline) saat produk belum punya thumbnail dari API.
export const PRODUCT_IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='400'%3E%3Crect width='640' height='400' fill='%23e2e8f0'/%3E%3Ctext x='320' y='205' font-family='system-ui,sans-serif' font-size='28' font-weight='600' fill='%2394a3b8' text-anchor='middle'%3ESolusite Studio%3C/text%3E%3C/svg%3E";

// Fallback: tebak kategori dari nama/label/tags bila API tidak mengirim `category`.
export function deriveCategory(name: string, label: string, tags: string[]) {
  const haystack = `${name} ${label} ${tags.join(" ")}`.toLowerCase();
  if (haystack.includes("cms")) return CMS_CATEGORY;
  return OTHERS_CATEGORY;
}

// Harga paket Statis / Dinamis per produk (pakai nilai API bila ada).
export function getStaticPrice(product: Product) {
  return product.staticPrice ?? STATIC_PRICE;
}

export function getDynamicPrice(product: Product) {
  return product.dynamicPrice ?? DYNAMIC_PRICE;
}

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

// Harga jual utama (final) yang ditampilkan di kartu/listing.
// Pakai `final_price` dari server bila ada; jika tidak: CMS → paket Statis, lainnya → harga produk.
export function getStartingPrice(product: Product): number {
  if (typeof product.finalPrice === "number" && product.finalPrice >= 0) {
    return product.finalPrice;
  }
  if (product.category === CMS_CATEGORY) return getStaticPrice(product);
  return product.price;
}

export type MarketingPricing = {
  finalPrice: number;
  originalPrice: number;
  savings: number;
  discount: Discount | null;
};

// Diskon untuk marketing: harga final TETAP (sesuai ketentuan), diskon hanya
// menampilkan "harga coret" yang lebih tinggi di atasnya agar terlihat hemat.
export function applyMarketingDiscount(
  finalPrice: number,
  discount: Discount | null,
): MarketingPricing {
  if (!discount) {
    return { finalPrice, originalPrice: finalPrice, savings: 0, discount: null };
  }

  const originalPrice =
    discount.type === "percentage" && discount.value < 100
      ? Math.round(finalPrice / (1 - discount.value / 100))
      : finalPrice + discount.value;

  return { finalPrice, originalPrice, savings: originalPrice - finalPrice, discount };
}

export function getMarketingPricing(
  product: Product,
  allDiscounts: Discount[] = [],
  now = new Date(),
): MarketingPricing {
  const finalPrice = getStartingPrice(product);
  const discount = getProductDiscount(product.id, allDiscounts, now);

  // Pakai `original_price` dari server bila ada; jika tidak, hitung dari diskon aktif.
  if (typeof product.originalPrice === "number" && product.originalPrice > finalPrice) {
    return {
      finalPrice,
      originalPrice: product.originalPrice,
      savings: product.originalPrice - finalPrice,
      discount,
    };
  }

  return applyMarketingDiscount(finalPrice, discount);
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

  const name = toString(item.name);
  const label = toString(item.label);
  const tags = toStringArray(item.tags);
  const category =
    toString(item.category).trim().toLowerCase() || deriveCategory(name, label, tags);

  const optionalNumber = (raw: unknown) =>
    raw === null || raw === undefined ? undefined : toNumber(raw);

  return {
    id: toNumber(item.id),
    categoryId: optionalNumber(item.category_id ?? item.categoryId),
    name,
    short: toString(item.short),
    description: toString(item.description),
    price: toNumber(item.price),
    label,
    status: toString(item.status),
    type: toString(item.type, "app") as Product["type"],
    availability: toString(item.availability, "ready") as Product["availability"],
    category,
    tags,
    demoUrl: toString(item.demo_url ?? item.demoUrl) || undefined,
    thumbnail: toString(item.thumbnail),
    thumbnailUrl:
      toString(item.thumbnail_url) || toString(item.thumbnail) || PRODUCT_IMAGE_PLACEHOLDER,
    staticPrice: optionalNumber(item.static_price ?? item.staticPrice),
    dynamicPrice: optionalNumber(item.dynamic_price ?? item.dynamicPrice),
    discountAmount: optionalNumber(item.discount_amount),
    finalPrice: optionalNumber(item.final_price),
    originalPrice: optionalNumber(item.original_price ?? item.originalPrice),
  };
}

export function normalizeCategory(value: unknown): Category {
  const item = toRecord(value);

  return {
    id: toNumber(item.id),
    slug: toString(item.slug).trim().toLowerCase(),
    name: toString(item.name),
    description: toString(item.description),
    sortOrder: toNumber(item.sort_order ?? item.sortOrder),
    isActive: toBoolean(item.is_active ?? item.isActive, true),
  };
}

export function normalizeSettings(value: unknown): Settings {
  const item = toRecord(value);
  const str = (raw: unknown, fallback: string) => toString(raw) || fallback;

  return {
    siteName: str(item.site_name ?? item.siteName, mockSettings.siteName),
    tagline: str(item.tagline, mockSettings.tagline),
    logoUrl: toString(item.logo_url ?? item.logoUrl) || null,
    whatsappNumber: str(item.whatsapp_number ?? item.whatsappNumber, mockSettings.whatsappNumber),
    whatsappMessage: str(
      item.whatsapp_message ?? item.whatsappMessage,
      mockSettings.whatsappMessage,
    ),
    email: str(item.email, mockSettings.email),
    phone: str(item.phone, mockSettings.phone),
    address: str(item.address, mockSettings.address),
    instagramUrl: toString(item.instagram_url ?? item.instagramUrl),
    facebookUrl: toString(item.facebook_url ?? item.facebookUrl),
    tiktokUrl: toString(item.tiktok_url ?? item.tiktokUrl),
    youtubeUrl: toString(item.youtube_url ?? item.youtubeUrl),
    metaTitle: str(item.meta_title ?? item.metaTitle, mockSettings.metaTitle),
    metaDescription: str(
      item.meta_description ?? item.metaDescription,
      mockSettings.metaDescription,
    ),
    metaKeywords: str(item.meta_keywords ?? item.metaKeywords, mockSettings.metaKeywords),
    ogImageUrl: toString(item.og_image_url ?? item.ogImageUrl) || null,
    googleAnalyticsId: toString(item.google_analytics_id ?? item.googleAnalyticsId),
    googleSiteVerification: toString(
      item.google_site_verification ?? item.googleSiteVerification,
    ),
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
  try {
    const products = await fetchPublicCollection("products", normalizeProduct);
    return products.length > 0 ? products : mockProducts;
  } catch {
    return mockProducts;
  }
}

export async function fetchCategories() {
  try {
    const categories = await fetchPublicCollection("categories", normalizeCategory);
    return categories.length > 0 ? categories : mockCategories;
  } catch {
    return mockCategories;
  }
}

export async function fetchDiscounts() {
  try {
    const discounts = await fetchPublicCollection("discounts", normalizeDiscount);
    return discounts.length > 0 ? discounts : mockDiscounts;
  } catch {
    return mockDiscounts;
  }
}
