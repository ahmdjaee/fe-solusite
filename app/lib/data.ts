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

export const products: Product[] = [
  {
    id: 1,
    name: "Boilerplate SaaS Pemula",
    short: "Boilerplate bisnis digital",
    description:
      "Template aplikasi untuk startup atau bisnis digital dengan halaman auth, dashboard, user management, dan struktur yang siap dikembangkan.",
    price: 2500000,
    label: "Aplikasi",
    status: "Siap",
    type: "app",
    availability: "ready",
    tags: ["Autentikasi", "Dasbor", "Skalabel"],
    thumbnail:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Kode Sumber Toko Online",
    short: "Codebase toko online",
    description:
      "Source code toko online modern dengan katalog produk, keranjang, checkout, dan manajemen pesanan.",
    price: 3500000,
    label: "Kode Sumber",
    status: "Siap",
    type: "source-code",
    availability: "ready",
    tags: ["Toko Online", "Checkout", "CMS"],
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Aplikasi Booking Layanan",
    short: "Reservasi layanan online",
    description:
      "Aplikasi booking layanan yang cocok untuk agency, klinik, konsultasi, atau bisnis appointment based.",
    price: 4500000,
    label: "Aplikasi",
    status: "Dapat Dikustomisasi",
    type: "app",
    availability: "custom",
    tags: ["Booking", "Kalender", "Formulir"],
    thumbnail:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
];

export const discounts: Discount[] = [
  {
    id: 1,
    productId: 1,
    name: "Launch Promo",
    code: "LAUNCH20",
    type: "percentage",
    value: 20,
    startsAt: "2026-01-01",
    endsAt: "2026-12-31",
    isActive: true,
  },
  {
    id: 2,
    productId: 2,
    name: "Promo Kode Sumber",
    code: "CODE500K",
    type: "fixed",
    value: 500000,
    startsAt: "2026-06-01",
    endsAt: "2026-08-31",
    isActive: true,
  },
  {
    id: 3,
    productId: 3,
    name: "Akses Awal Aplikasi Booking",
    code: "BOOKING15",
    type: "percentage",
    value: 15,
    startsAt: "2026-07-01",
    endsAt: "2026-09-30",
    isActive: false,
  },
];

export const services: Service[] = [
  {
    id: 1,
    name: "Pengembangan Situs Web Kustom",
    description:
      "Pembuatan situs profil perusahaan, halaman awal, katalog, atau situs penjualan sesuai kebutuhan bisnis Anda.",
    level: "Populer",
    price: 5000000,
    availability: "custom",
    features: ["UI responsif", "SEO dasar", "Form kontak", "Bantuan deploy"],
  },
  {
    id: 2,
    name: "Pengembangan Aplikasi Web",
    description:
      "Pembuatan aplikasi berbasis web dengan fitur kustom seperti dasbor admin, pengaturan peran, dan integrasi sistem.",
    level: "Lanjutan",
    price: 12000000,
    availability: "custom",
    features: ["Dasbor", "Akses peran", "Integrasi API", "Dokumentasi"],
  },
  {
    id: 3,
    name: "Pemeliharaan & Dukungan",
    description:
      "Layanan maintenance bulanan untuk bug fixing, update kecil, monitoring, dan support teknis.",
    level: "Bulanan",
    price: 1500000,
    availability: "custom",
    features: ["Perbaikan bug", "Pembaruan kecil", "Pemantauan", "Dukungan teknis"],
  },
];

export const portfolio: PortfolioItem[] = [
  {
    id: 1,
    name: "Sistem Dasbor SDM",
    description: "Dasbor internal untuk manajemen data karyawan, absensi, dan laporan.",
    stack: ["Next.js", "Tailwind", "Laravel API"],
  },
  {
    id: 2,
    name: "Platform Booking Klinik",
    description: "Sistem reservasi pasien dengan jadwal dokter dan admin panel lengkap.",
    stack: ["Next.js", "MySQL", "REST API"],
  },
  {
    id: 3,
    name: "Situs Katalog Produk",
    description: "Website katalog produk dengan filtering, inquiry form, dan manajemen item.",
    stack: ["TypeScript", "Tailwind", "App Router"],
  },
];

export const plans: Plan[] = [
  {
    id: 1,
    name: "Dasar",
    description: "Halaman awal atau situs profil sederhana.",
    price: 3000000,
    highlight: false,
    features: ["Hingga 5 bagian", "Desain responsif", "Form kontak"],
  },
  {
    id: 2,
    name: "Profesional",
    description: "Website bisnis dengan admin panel dasar.",
    price: 7500000,
    highlight: true,
    features: ["Halaman multi bagian", "Panel admin", "Manajemen data", "Mode gelap"],
  },
  {
    id: 3,
    name: "Perusahaan",
    description: "Aplikasi web kustom dengan integrasi backend.",
    price: 15000000,
    highlight: false,
    features: ["Modul kustom", "Integrasi API", "Dokumentasi", "Dukungan deployment"],
  },
];

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

export function getProductById(id: number) {
  return products.find((item) => item.id === id) ?? null;
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
