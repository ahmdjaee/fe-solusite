import Link from "next/link";
import { notFound } from "next/navigation";

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

const products: Product[] = [
  {
    id: 1,
    name: "Starter SaaS Boilerplate",
    short: "Boilerplate bisnis digital",
    description:
      "Template aplikasi untuk startup atau bisnis digital dengan halaman auth, dashboard, user management, dan struktur yang siap dikembangkan. Cocok untuk Anda yang ingin meluncurkan produk digital lebih cepat tanpa memulai dari nol.",
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
      "Source code toko online modern dengan katalog produk, keranjang, checkout, dan manajemen pesanan. Tepat untuk bisnis yang ingin punya fondasi e-commerce yang cepat dan efisien untuk dikembangkan.",
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
      "Aplikasi booking layanan yang cocok untuk agency, klinik, konsultasi, atau bisnis appointment based. Membantu calon customer melakukan reservasi dengan alur yang lebih rapi dan profesional.",
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

function formatPrice(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getProductById(id: number) {
  return products.find((item) => item.id === id) ?? null;
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: String(product.id),
  }));
}

export function generateMetadata({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  const product = getProductById(id);

  if (!product) {
    return {
      title: "Produk tidak ditemukan",
    };
  }

  return {
    title: `${product.name} | Product Detail`,
    description: product.short,
  };
}

export default async function ProductDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params; // 🔥 ini kuncinya

  const id = Number(resolvedParams.id);

  if (Number.isNaN(id)) {
    notFound();
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }


  const whatsappHref = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo, saya tertarik dengan produk ${product.name}. Bisa jelaskan lebih detail?`,
  )}`;

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="brand-shadow flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              D
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Developer Portfolio</p>
              <h1 className="text-base font-semibold sm:text-lg">Product Detail</h1>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
            >
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="relative">
        <div className="hero-blob-left pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full blur-3xl" />
        <div className="hero-blob-right pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl" />
        <div className="hero-blob-bottom pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl" />
        <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.05]" />

        <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="brand-card overflow-hidden rounded-[32px] border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={product.thumbnail} alt={product.name} className="h-full w-full object-cover" />
                </div>
              </div>

              <div className="brand-card rounded-[32px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-bold">Tentang produk ini</h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs text-slate-400">Kategori</p>
                    <p className="mt-2 font-semibold">{product.label}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="mt-2 font-semibold">{product.status}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs text-slate-400">Type</p>
                    <p className="mt-2 font-semibold">{product.type === "source-code" ? "Source Code" : "Aplikasi"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="brand-card rounded-[32px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:border-brand-900/50 dark:bg-brand-900/30 dark:text-brand-300">
                    {product.label}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                    {product.status}
                  </span>
                </div>

                <h2 className="mt-4 text-3xl font-bold leading-tight">{product.name}</h2>
                <p className="mt-3 text-base text-slate-500 dark:text-slate-400">{product.short}</p>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Harga mulai dari</p>
                  <p className="mt-2 text-4xl font-bold text-brand-600">{formatPrice(product.price)}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-2xl bg-[#25D366] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
                  >
                    Chat via WhatsApp
                  </a>
                  <Link
                    href="/#products"
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                  >
                    Lihat produk lain
                  </Link>
                </div>
              </div>

              <div className="brand-card rounded-[32px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-bold">Yang Anda dapatkan</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Source dan struktur project yang rapi.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Desain modern yang siap dikembangkan lebih lanjut.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Mudah diintegrasikan ke backend Laravel REST API.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Dukungan kustomisasi sesuai kebutuhan bisnis.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 Developer Store. Dibuat dengan Next.js + Tailwind CSS.</p>
          <p>Halaman detail produk siap dihubungkan ke backend Laravel.</p>
        </div>
      </footer>

      <a
        href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20konsultasi%20produk%20digital"
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
