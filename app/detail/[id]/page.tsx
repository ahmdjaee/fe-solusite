import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice, getProductPricing } from "../../lib/data";
import { fetchServerProductById } from "../../lib/server-data";
import { LanguageToggleButton, LocalizedText } from "../../localized-text";
import { localizedText } from "../../lang";
import {
  buildProductJsonLd,
  getSeoImageUrl,
  safeJsonLd,
  siteName,
} from "../../lib/seo";

export const dynamic = "force-dynamic";
const detailCopy = localizedText.detail;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: productId } = await params;
  const id = Number(productId);
  const product = await fetchServerProductById(id);

  if (!product) {
    return {
      title: "Produk tidak ditemukan",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonical = `/detail/${product.id}`;
  const image = getSeoImageUrl(product.thumbnail);
  const title = product.name;
  const socialTitle = `${product.name} | ${siteName}`;
  const description = product.short || product.description;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      title: socialTitle,
      description,
      siteName,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${product.name} - ${siteName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // 🔥 ini kuncinya

  const id = Number(resolvedParams.id);

  if (Number.isNaN(id)) {
    notFound();
  }

  const product = await fetchServerProductById(id);

  if (!product) {
    notFound();
  }

  const pricing = getProductPricing(product);
  const jsonLd = buildProductJsonLd(product);
  const whatsappHref = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo, saya tertarik dengan produk ${product.name}${
      pricing.discount ? ` dengan promo ${pricing.discount.code}` : ""
    }. Bisa jelaskan lebih detail?`,
  )}`;

  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <script
        id="product-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="brand-shadow flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              S
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Portofolio Pengembang</p>
              <p className="text-base font-semibold sm:text-lg">
                <LocalizedText text={detailCopy.productDetail} />
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageToggleButton />
            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium dark:border-slate-700"
            >
              <LocalizedText text={detailCopy.back} />
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
                  <img
                    src={product.thumbnail}
                    alt={`Preview produk ${product.name} dari ${siteName}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="brand-card rounded-[32px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-xl font-bold">
                  <LocalizedText text={detailCopy.aboutProduct} />
                </h3>
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {product.description}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs text-slate-400">
                      <LocalizedText text={detailCopy.category} />
                    </p>
                    <p className="mt-2 font-semibold">{product.label}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs text-slate-400">Status</p>
                    <p className="mt-2 font-semibold">{product.status}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
                    <p className="text-xs text-slate-400">
                      <LocalizedText text={detailCopy.type} />
                    </p>
                    <p className="mt-2 font-semibold">
                      {product.type === "source-code" ? (
                        <LocalizedText text={detailCopy.sourceCode} />
                      ) : (
                        <LocalizedText text={detailCopy.app} />
                      )}
                    </p>
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
                  {pricing.savings > 0 && (
                    <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                      {pricing.discount ? (
                        <>
                          <LocalizedText text={detailCopy.promo} /> {pricing.discount.code}
                        </>
                      ) : (
                        <LocalizedText text={detailCopy.activePromo} />
                      )}
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight">{product.name}</h1>
                <p className="mt-3 text-base text-slate-500 dark:text-slate-400">{product.short}</p>

                <div className="mt-6">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    <LocalizedText text={detailCopy.startsFrom} />
                  </p>
                  <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2">
                    <p className="text-4xl font-bold text-brand-600">
                      {formatPrice(pricing.finalPrice)}
                    </p>
                    {pricing.savings > 0 && (
                      <p className="pb-1 text-base font-semibold text-slate-400 line-through">
                        {formatPrice(pricing.originalPrice)}
                      </p>
                    )}
                  </div>
                  {pricing.savings > 0 && (
                    <p className="mt-2 text-sm font-semibold text-rose-600 dark:text-rose-300">
                      <LocalizedText text={detailCopy.save} />{" "}
                      {formatPrice(pricing.savings)}
                      {pricing.discount ? (
                        <>
                          {" "}
                          <LocalizedText text={detailCopy.until} />{" "}
                          {pricing.discount.endsAt}
                        </>
                      ) : (
                        ""
                      )}
                    </p>
                  )}
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
                    <LocalizedText text={detailCopy.chatViaWhatsapp} />
                  </a>
                  <Link
                    href="/#products"
                    className="rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                  >
                    <LocalizedText text={detailCopy.viewOtherProducts} />
                  </Link>
                </div>
              </div>

              <div className="brand-card rounded-[32px] border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <h3 className="text-lg font-bold">
                  <LocalizedText text={detailCopy.whatYouGet} />
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>
                      <LocalizedText text={detailCopy.cleanSource} />
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>
                      <LocalizedText text={detailCopy.modernDesign} />
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>
                      <LocalizedText text={detailCopy.laravelIntegration} />
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>
                      <LocalizedText text={detailCopy.customizationSupport} />
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>
            <LocalizedText text={detailCopy.footerBrand} />
          </p>
          <p>
            <LocalizedText text={detailCopy.footerBody} />
          </p>
        </div>
      </footer>

      <a
        href="https://wa.me/6281234567890?text=Halo%2C%20saya%20ingin%20konsultasi%20produk%20digital"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:scale-105 hover:bg-[#1ebe5d]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-lg">
          ✆
        </span>
        <span className="hidden sm:inline">
          <LocalizedText text={detailCopy.whatsappChat} />
        </span>
      </a>
    </div>
  );
}
