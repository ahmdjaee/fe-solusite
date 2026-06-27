import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchLandingData, fetchServerProductById } from "../../lib/server-data";
import { formatPrice, getMarketingPricing, getProductDiscount } from "../../lib/data";
import { PurchaseOptions } from "./purchase-options";
import { LanguageToggleButton, LocalizedText, ThemeToggleButton } from "../../localized-text";
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
  const image = getSeoImageUrl(product.thumbnailUrl);
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

  const jsonLd = buildProductJsonLd(product);

  // Produk terkait: kategori yang sama, kecuali produk ini.
  const { products: allProducts, discounts } = await fetchLandingData();
  const related = allProducts
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);
  const productDiscount = getProductDiscount(product.id, discounts);

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
              <p className="text-sm text-slate-500 dark:text-slate-400">Solusite Studio</p>
              <p className="text-base font-semibold sm:text-lg">
                <LocalizedText text={detailCopy.productDetail} />
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggleButton />
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
                    src={product.thumbnailUrl}
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
                </div>

                <h1 className="mt-4 text-3xl font-bold leading-tight">{product.name}</h1>
                <p className="mt-3 text-base text-slate-500 dark:text-slate-400">{product.short}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                  <PurchaseOptions product={product} discount={productDiscount} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="relative mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-600">
                <LocalizedText text={detailCopy.relatedEyebrow} />
              </p>
              <h2 className="text-2xl font-bold">
                <LocalizedText text={detailCopy.relatedTitle} />
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/detail/${item.id}`}
                  className="brand-card group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={item.thumbnailUrl}
                      alt={`Preview ${item.name}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {item.label && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-800 backdrop-blur">
                        {item.label}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-1 text-base font-bold">{item.name}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                      {item.short}
                    </p>
                    {(() => {
                      const itemPricing = getMarketingPricing(item, discounts);
                      return (
                        <div className="mt-auto pt-3">
                          <p className="text-[11px] uppercase tracking-wide text-slate-400">
                            <LocalizedText text={detailCopy.startsFrom} />
                          </p>
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <p className="text-lg font-bold text-brand-600">
                              {formatPrice(itemPricing.finalPrice)}
                            </p>
                            {itemPricing.savings > 0 && (
                              <p className="text-xs font-semibold text-slate-400 line-through">
                                {formatPrice(itemPricing.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
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
