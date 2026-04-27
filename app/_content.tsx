"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
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

type Service = {
  id: number;
  name: string;
  description: string;
  level: string;
  price: number;
  availability: "custom" | "ready";
  features: string[];
};

type PortfolioItem = {
  id: number;
  name: string;
  description: string;
  stack: string[];
};

type Plan = {
  id: number;
  name: string;
  description: string;
  price: number;
  highlight: boolean;
  features: string[];
};

const products: Product[] = [
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

const services: Service[] = [
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

const portfolio: PortfolioItem[] = [
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

const plans: Plan[] = [
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

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function filterProducts(items: Product[], search: string, category: string, availability: string) {
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

function filterServices(items: Service[], search: string, category: string, availability: string) {
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

function getSelfTests() {
  return [
    {
      name: "formatPrice mengembalikan Rupiah",
      pass: formatPrice(2500000).includes("Rp"),
    },
    {
      name: "filter product by source-code",
      pass: filterProducts(products, "", "source-code", "all").length === 1,
    },
    {
      name: "filter product by keyword",
      pass: filterProducts(products, "booking", "all", "all").length === 1,
    },
    {
      name: "filter service by category service",
      pass: filterServices(services, "", "service", "all").length === services.length,
    },
    {
      name: "setiap product punya thumbnail",
      pass: products.every((item) => item.thumbnail.length > 0),
    },
    {
      name: "ada minimal 1 plan populer",
      pass: plans.some((item) => item.highlight),
    },
  ];
}

export default function NextJsStorefrontPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedTheme = window.localStorage.getItem("theme");
    const isDark = savedTheme === "dark";
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const results = getSelfTests();
    results.forEach((test) => {
      const log = test.pass ? console.log : console.error;
      log(`[self-test] ${test.pass ? "PASS" : "FAIL"}: ${test.name}`);
    });
  }, []);

  const filteredProducts = useMemo(
    () => filterProducts(products, search, selectedCategory, selectedType),
    [search, selectedCategory, selectedType],
  );

  const filteredServices = useMemo(
    () => filterServices(services, search, selectedCategory, selectedType),
    [search, selectedCategory, selectedType],
  );

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="brand-shadow flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              D
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Developer Portfolio</p>
              <h1 className="text-base font-semibold sm:text-lg">Digital Product & Services</h1>
            </div>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <a href="#products" className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300">
              Produk
            </a>
            <a href="#services" className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300">
              Jasa
            </a>
            <a href="#portfolio" className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300">
              Portfolio
            </a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300">
              Harga
            </a>
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:border-brand-300 hover:text-brand-600 dark:border-slate-700"
              type="button"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
            <a href="/login" className="brand-shadow rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
              Login Admin
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700"
              type="button"
            >
              🌓
            </button>
            <button
              onClick={() => setMobileMenu((prev) => !prev)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium dark:border-slate-700"
              type="button"
            >
              ☰
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <div className="flex flex-col gap-3">
              <a onClick={() => setMobileMenu(false)} href="#products" className="text-sm font-medium">
                Produk
              </a>
              <a onClick={() => setMobileMenu(false)} href="#services" className="text-sm font-medium">
                Jasa
              </a>
              <a onClick={() => setMobileMenu(false)} href="#portfolio" className="text-sm font-medium">
                Portfolio
              </a>
              <a onClick={() => setMobileMenu(false)} href="#pricing" className="text-sm font-medium">
                Harga
              </a>
              <a href="/login" className="rounded-xl bg-brand-600 px-4 py-3 text-center text-sm font-semibold text-white">
                Login Admin
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden">
          <div className="hero-blob-left pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="hero-blob-right pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl" />
          <div className="hero-blob-bottom pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl" />
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.06]" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-900/60 dark:bg-brand-900/30 dark:text-brand-300">
                Website • Aplikasi • Source Code • Jasa Developer
              </span>
              <h2 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
                Jual produk digital dan jasa developer dalam satu website yang modern.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
                Cocok untuk menampilkan aplikasi siap pakai, source code premium, layanan pembuatan website, maintenance, integrasi sistem, dan konsultasi development.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href="#products" className="brand-shadow rounded-2xl bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700">
                  Lihat Produk
                </a>
                <a href="#services" className="rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200">
                  Lihat Jasa
                </a>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-3">
                <div className="brand-card rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-2xl font-bold text-brand-600">{products.length}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Produk Digital</p>
                </div>
                <div className="brand-card rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-2xl font-bold text-brand-600">{services.length}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Layanan</p>
                </div>
                <div className="brand-card rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-2xl font-bold text-brand-600">24/7</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Support Ready</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="brand-card rounded-3xl border border-brand-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Featured Product</p>
                    <h3 className="mt-2 text-xl font-bold">Starter SaaS Boilerplate</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      Template aplikasi siap pakai untuk mempercepat proses development produk digital Anda.
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    Best Seller
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">Auth</div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">Dashboard</div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">Billing Ready</div>
                  <div className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">API Ready</div>
                </div>
              </div>
              <div className="brand-card rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Admin</p>
                <h3 className="mt-2 text-lg font-bold">Kelola data mudah</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Panel admin terpisah agar storefront tetap bersih dan fokus jualan.
                </p>
              </div>
              <div className="brand-card rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Scalable</p>
                <h3 className="mt-2 text-lg font-bold">Siap ke Laravel</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Struktur data dibuat modular agar mudah dipindahkan ke REST API.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="brand-card rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold">Cari produk, source code, atau jasa</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Filter sederhana dengan data lokal.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:w-2/3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Cari nama atau deskripsi..."
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="all">Semua kategori</option>
                  <option value="app">Aplikasi</option>
                  <option value="source-code">Source Code</option>
                  <option value="service">Jasa</option>
                </select>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950"
                >
                  <option value="all">Semua status</option>
                  <option value="ready">Ready Product</option>
                  <option value="custom">Custom Service</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-600">Produk Digital</p>
              <h3 className="text-2xl font-bold">Aplikasi & Source Code</h3>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">{filteredProducts.length} item</span>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="brand-card group overflow-hidden rounded-[30px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <a href={`/detail/${product.id}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-800 backdrop-blur">
                        {product.label}
                      </span>
                      <span className="rounded-full bg-emerald-400/90 px-3 py-1 text-[11px] font-semibold text-emerald-950 backdrop-blur">
                        {product.status}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Digital Product</p>
                      <h4 className="mt-2 text-xl font-bold leading-tight text-white">{product.name}</h4>
                    </div>
                  </div>
                </a>
                <div className="p-5">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{product.short}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {product.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                    <div>
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">Mulai dari</p>
                      <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    <a
                      href={`/detail/${product.id}`}
                      className="brand-shadow rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      Lihat Detail
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-brand-600">Layanan Developer</p>
            <h3 className="text-2xl font-bold">Jasa yang bisa Anda pesan</h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <div key={service.id} className="brand-card rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-bold">{service.name}</h4>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {service.level}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{service.description}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-brand-600">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Mulai dari</p>
                    <p className="text-lg font-bold text-brand-600">{formatPrice(service.price)}</p>
                  </div>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                  >
                    Pesan
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="portfolio" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="brand-card rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950">
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-600">Portfolio</p>
              <h3 className="text-2xl font-bold">Contoh project yang pernah dibuat</h3>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {portfolio.map((item) => (
                <div key={item.id} className="brand-card rounded-3xl border border-white/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                  <h4 className="text-lg font-bold">{item.name}</h4>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {item.stack.map((tech) => (
                      <span key={tech} className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-brand-600">Paket Harga</p>
            <h3 className="text-2xl font-bold">Pilihan paket untuk bisnis Anda</h3>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`brand-card rounded-3xl border bg-white p-6 dark:bg-slate-900 ${
                  plan.highlight
                    ? "border-brand-500 ring-2 ring-brand-200 dark:ring-brand-900/50"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-bold">{plan.name}</h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{plan.description}</p>
                  </div>
                  {plan.highlight && (
                    <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">Populer</span>
                  )}
                </div>
                <p className="mt-5 text-3xl font-bold text-brand-600">{formatPrice(plan.price)}</p>
                <ul className="mt-5 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <span className="text-brand-600">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="brand-shadow mt-6 inline-flex w-full justify-center rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  Pilih Paket
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Developer Store. Dibuat dengan Next.js + Tailwind CSS.</p>
          <p>Struktur data siap diintegrasikan ke Laravel REST API.</p>
        </div>
      </footer>

      <a
        href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20dan%20jasa%20developer%20Anda"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:scale-105 hover:bg-[#1ebe5d]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg">✆</span>
        <span className="hidden sm:inline">Chat WhatsApp</span>
      </a>
    </div>
  );
}
