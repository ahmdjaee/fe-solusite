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
};

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
    name: "Starter SaaS Boilerplate",
    short: "Boilerplate bisnis digital",
    description:
      "Template aplikasi untuk startup atau bisnis digital dengan halaman auth, dashboard, user management, dan struktur yang siap dikembangkan.",
    price: 2500000,
    label: "Aplikasi",
    status: "Ready",
    type: "app",
    availability: "ready",
    tags: ["Auth", "Dashboard", "Scalable"],
    thumbnail:
      "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "E-Commerce Source Code",
    short: "Codebase toko online",
    description:
      "Source code toko online modern dengan katalog produk, keranjang, checkout, dan manajemen pesanan.",
    price: 3500000,
    label: "Source Code",
    status: "Ready",
    type: "source-code",
    availability: "ready",
    tags: ["E-Commerce", "Checkout", "CMS"],
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Booking App for Services",
    short: "Reservasi layanan online",
    description:
      "Aplikasi booking layanan yang cocok untuk agency, klinik, konsultasi, atau bisnis appointment based.",
    price: 4500000,
    label: "Aplikasi",
    status: "Customizable",
    type: "app",
    availability: "custom",
    tags: ["Booking", "Calendar", "Form"],
    thumbnail:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  },
];

export const services: Service[] = [
  {
    id: 1,
    name: "Custom Website Development",
    description:
      "Pembuatan website company profile, landing page, katalog, atau website penjualan sesuai kebutuhan bisnis Anda.",
    level: "Popular",
    price: 5000000,
    availability: "custom",
    features: ["UI responsive", "SEO basic", "Form kontak", "Deploy assistance"],
  },
  {
    id: 2,
    name: "Web App Development",
    description:
      "Pembuatan aplikasi berbasis web dengan fitur custom seperti dashboard admin, role management, dan integrasi sistem.",
    level: "Advanced",
    price: 12000000,
    availability: "custom",
    features: ["Dashboard", "Role access", "API integration", "Documentation"],
  },
  {
    id: 3,
    name: "Maintenance & Support",
    description:
      "Layanan maintenance bulanan untuk bug fixing, update kecil, monitoring, dan support teknis.",
    level: "Retainer",
    price: 1500000,
    availability: "custom",
    features: ["Bug fix", "Minor update", "Monitoring", "Technical support"],
  },
];

export const portfolio: PortfolioItem[] = [
  {
    id: 1,
    name: "HR Dashboard System",
    description: "Dashboard internal untuk manajemen data karyawan, absensi, dan laporan.",
    stack: ["Next.js", "Tailwind", "Laravel API"],
  },
  {
    id: 2,
    name: "Clinic Booking Platform",
    description: "Sistem reservasi pasien dengan jadwal dokter dan admin panel lengkap.",
    stack: ["Next.js", "MySQL", "REST API"],
  },
  {
    id: 3,
    name: "Product Catalog Website",
    description: "Website katalog produk dengan filtering, inquiry form, dan manajemen item.",
    stack: ["TypeScript", "Tailwind", "App Router"],
  },
];

export const plans: Plan[] = [
  {
    id: 1,
    name: "Basic",
    description: "Landing page atau website profil sederhana.",
    price: 3000000,
    highlight: false,
    features: ["Up to 5 sections", "Responsive design", "Contact form"],
  },
  {
    id: 2,
    name: "Professional",
    description: "Website bisnis dengan admin panel dasar.",
    price: 7500000,
    highlight: true,
    features: ["Multi section page", "Admin panel", "Data management", "Dark mode"],
  },
  {
    id: 3,
    name: "Enterprise",
    description: "Aplikasi web custom dengan integrasi backend.",
    price: 15000000,
    highlight: false,
    features: ["Custom modules", "API integration", "Documentation", "Deployment support"],
  },
];

export function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
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

export async function fetchProducts() {
  return products;
}

export async function fetchServices() {
  return services;
}
