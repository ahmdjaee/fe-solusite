"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import {
  fetchProducts,
  fetchDiscounts,
  fetchCategories,
  formatPrice,
  getMarketingPricing,
  CMS_CATEGORY,
} from "./lib/data";
import type { Category, Discount, Product } from "./lib/data";
import Link from "next/link";
import type { LandingData } from "./lib/server-data";
import { useLanguage } from "./language-provider";
import { SiteHeader } from "./site-header";
import { getTranslations } from "./lang";

type HomeContentProps = {
  initialData: LandingData;
};

type Copy = ReturnType<typeof getTranslations>["landing"];

const MAX_CARDS_PER_CATEGORY = 5;

function hasData<T>(items: T[]) {
  return items.length > 0 ? items : undefined;
}

// Nama & deskripsi kategori: pakai copy dwibahasa untuk slug yang dikenal,
// selebihnya pakai nama dari API (kategori dinamis).
function categoryDisplay(category: Category, copy: Copy) {
  if (category.slug === "cms") {
    return { title: copy.categoryCms, description: copy.categoryCmsDesc };
  }
  if (category.slug === "others") {
    return { title: copy.categoryOthers, description: copy.categoryOthersDesc };
  }
  return { title: category.name, description: category.description };
}

function ProductCard({
  product,
  discounts,
  copy,
  brandEyebrow,
}: {
  product: Product;
  discounts: Discount[];
  copy: Copy;
  brandEyebrow: string;
}) {
  const pricing = getMarketingPricing(product, discounts);
  const showDiscount = pricing.savings > 0;

  return (
    <article className="brand-card group flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <Link href={`/detail/${product.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product.thumbnailUrl}
            alt={`Preview ${product.name} dari ${brandEyebrow}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
          <div className="absolute left-3 top-3 flex flex-wrap items-center gap-2">
            {product.label && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-800 backdrop-blur">
                {product.label}
              </span>
            )}
            {showDiscount && (
              <span className="rounded-full bg-rose-500/95 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                {pricing.discount?.type === "percentage"
                  ? `${pricing.discount.value}% OFF`
                  : `${formatPrice(pricing.savings)} OFF`}
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-base font-bold leading-tight">{product.name}</h4>
        <p className="mt-1.5 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {product.short}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              {showDiscount ? copy.activePromo : copy.startsFrom}
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatPrice(pricing.finalPrice)}
              </p>
              {showDiscount && (
                <p className="text-xs font-semibold text-slate-400 line-through">
                  {formatPrice(pricing.originalPrice)}
                </p>
              )}
            </div>
          </div>
          <Link
            href={`/detail/${product.id}`}
            className="brand-shadow shrink-0 rounded-xl bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-brand-700"
          >
            {copy.detail}
          </Link>
        </div>
      </div>
    </article>
  );
}

function CategoryRow({
  title,
  description,
  href,
  products,
  discounts,
  copy,
  brandEyebrow,
}: {
  title: string;
  description: string;
  href: string;
  products: Product[];
  discounts: Discount[];
  copy: Copy;
  brandEyebrow: string;
}) {
  const visible = products.slice(0, MAX_CARDS_PER_CATEGORY);
  const hasMore = products.length > MAX_CARDS_PER_CATEGORY;

  return (
    <div>
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold sm:text-2xl">{title}</h3>
          <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 sm:inline-flex"
        >
          {copy.viewAll}
          <span aria-hidden>→</span>
        </Link>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          {copy.categoryEmpty}
        </div>
      ) : (
        <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:thin] sm:mx-0 sm:px-0">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              discounts={discounts}
              copy={copy}
              brandEyebrow={brandEyebrow}
            />
          ))}
          {hasMore && (
            <Link
              href={href}
              className="flex w-[160px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-brand-300 bg-brand-50/50 p-4 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-900/60 dark:bg-brand-900/20 dark:text-brand-300"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg text-white">
                →
              </span>
              {copy.viewAll}
            </Link>
          )}
        </div>
      )}

      <Link
        href={href}
        className="mt-4 inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 sm:hidden"
      >
        {copy.viewAll}
        <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

export default function HomeContent({ initialData }: HomeContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const copy = getTranslations(language).landing;

  const {
    data: products = [],
    isLoading: productsLoading,
    isError: productsError,
  } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: hasData<Product>(initialData.products),
    staleTime: 1000 * 60 * 5,
  });

  const { data: discounts = [] } = useQuery({
    queryKey: ["discounts"],
    queryFn: fetchDiscounts,
    initialData: hasData<Discount>(initialData.discounts),
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    initialData: hasData<Category>(initialData.categories),
    staleTime: 1000 * 60 * 5,
  });

  // Kelompokkan produk per kategori (dinamis, urut sesuai sortOrder dari API).
  const categoryRows = [...categories]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((category) => ({
      category,
      items: products.filter((product) => product.category === category.slug),
    }))
    .filter((row) => row.items.length > 0);

  const cmsProducts = products.filter((product) => product.category === CMS_CATEGORY);
  const featuredProduct = cmsProducts[0] ?? products[0] ?? null;
  const featuredPricing = featuredProduct ? getMarketingPricing(featuredProduct, discounts) : null;

  const spring = { type: "spring" as const, stiffness: 120, damping: 18 };
  const fadeUp = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };
  const stagger = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.08,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <SiteHeader />

      <main>
        {productsError && (
          <section className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 sm:px-6 lg:px-8">
            {copy.apiError}
          </section>
        )}

        <section id="home" className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.04]" />
          <div className="hero-blob-left pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full blur-3xl dark:opacity-20 dark:saturate-50" />
          <div className="hero-blob-right pointer-events-none absolute -right-20 top-10 h-96 w-96 rounded-full blur-3xl dark:opacity-20 dark:saturate-50" />
          <div className="hero-blob-bottom pointer-events-none absolute -bottom-24 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full blur-3xl dark:opacity-[0.12] dark:saturate-50" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="flex flex-col"
            >
              <motion.span
                variants={fadeUp}
                transition={spring}
                className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur dark:border-brand-900/60 dark:bg-brand-900/20 dark:text-brand-300"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
                </span>
                {copy.heroBadge}
              </motion.span>

              <motion.h1
                variants={fadeUp}
                transition={spring}
                className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
              >
                {copy.heroTitleA}{" "}
                <span className="relative whitespace-nowrap">
                  <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-sky-400 bg-clip-text text-transparent">
                    {copy.heroTitleHighlight}
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2.5 w-full text-brand-400/70"
                  >
                    <path
                      d="M2 8c60-6 236-6 296 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={spring}
                className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300"
              >
                {copy.heroBody}
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={spring}
                className="mt-7 flex flex-col gap-3 sm:flex-row"
              >
                <a
                  href="#products"
                  className="brand-shadow group inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 px-6 py-3.5 text-sm font-semibold text-white transition hover:from-brand-700 hover:to-brand-600"
                >
                  {copy.viewProducts}
                  <span className="transition group-hover:translate-x-0.5" aria-hidden>
                    →
                  </span>
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white/60 px-6 py-3.5 text-sm font-semibold text-slate-700 backdrop-blur transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200"
                >
                  {copy.heroConsult}
                </a>
              </motion.div>

              <motion.ul
                variants={fadeUp}
                transition={spring}
                className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
              >
                {[copy.heroF1, copy.heroF2, copy.heroF3].map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                      <svg viewBox="0 0 20 20" className="h-3 w-3" fill="none" aria-hidden>
                        <path
                          d="M4 10l4 4 8-8"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {feature}
                  </li>
                ))}
              </motion.ul>

              <motion.div
                variants={fadeUp}
                transition={spring}
                className="mt-7 flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400"
              >
                <div className="flex -space-x-2">
                  {[
                    "from-brand-400 to-brand-600",
                    "from-sky-400 to-sky-600",
                    "from-indigo-400 to-indigo-600",
                  ].map((gradient, index) => (
                    <span
                      key={index}
                      className={`h-7 w-7 rounded-full border-2 border-white bg-gradient-to-br dark:border-slate-950 ${gradient}`}
                    />
                  ))}
                </div>
                <span>{copy.heroTrust}</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...spring, delay: 0.15 }}
              className="relative mx-auto w-full max-w-md lg:max-w-none"
            >
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-full bg-gradient-to-tr from-brand-500/25 via-sky-400/15 to-transparent blur-3xl dark:from-brand-600/15 dark:via-sky-500/5" />

              {/* Browser mockup */}
              <div className="brand-card overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-2xl ring-1 ring-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
                  <span className="h-3 w-3 rounded-full bg-rose-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <div className="ml-3 flex flex-1 items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-[11px] text-slate-400 dark:bg-slate-800">
                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
                      <path d="M5 9V7a5 5 0 0110 0v2h1a1 1 0 011 1v7a1 1 0 01-1 1H4a1 1 0 01-1-1v-7a1 1 0 011-1h1zm2 0h6V7a3 3 0 00-6 0v2z" />
                    </svg>
                    solusite.id
                  </div>
                </div>

                {featuredProduct ? (
                  <Link href={`/detail/${featuredProduct.id}`} className="block">
                    <div className="relative aspect-[16/11] overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={featuredProduct.thumbnailUrl}
                        alt={`Preview ${featuredProduct.name}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-5 pr-36">
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-brand-700 backdrop-blur">
                          {copy.featuredProduct}
                        </span>
                        <h3 className="mt-3 text-xl font-bold text-white">
                          {featuredProduct.name}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-sm text-white/80">
                          {featuredProduct.short}
                        </p>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="flex aspect-[16/11] items-center justify-center p-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    {productsLoading ? "…" : copy.waitingFeatured}
                  </div>
                )}
              </div>

              {/* Floating accent cards */}
              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="brand-card absolute -left-4 top-10 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/95 px-3.5 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:-left-8"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path
                      d="M12 20h9M3 20l1-4 11-11 3 3-11 11-4 1z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs font-semibold">{copy.heroFloatManage}</span>
              </motion.div>

              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                className="brand-card absolute -right-3 top-28 flex items-center gap-2 rounded-2xl border border-slate-100 bg-white/95 px-3.5 py-2.5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:-right-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path
                      d="M4 10l4 4 8-8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="text-xs font-semibold">{copy.heroFloatNoCode}</span>
              </motion.div>

              <motion.div
                animate={prefersReducedMotion ? undefined : { y: [0, -8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="brand-card absolute -bottom-5 right-3 rounded-2xl border border-slate-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95 sm:-right-4"
              >
                <p className="text-[10px] uppercase tracking-wide text-slate-400">
                  {copy.startsFrom}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-brand-600">
                    {featuredPricing ? formatPrice(featuredPricing.finalPrice) : "—"}
                  </p>
                  {featuredPricing && featuredPricing.savings > 0 && (
                    <p className="text-xs font-semibold text-slate-400 line-through">
                      {formatPrice(featuredPricing.originalPrice)}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-sm font-semibold text-brand-600">{copy.productsEyebrow}</p>
            <h2 className="text-2xl font-bold sm:text-3xl">{copy.productsTitle}</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
              {copy.productsBody}
            </p>
          </div>

          <div className="space-y-12">
            {categoryRows.map(({ category, items }) => {
              const { title, description } = categoryDisplay(category, copy);
              return (
                <CategoryRow
                  key={category.slug}
                  title={title}
                  description={description}
                  href={`/product?category=${category.slug}`}
                  products={items}
                  discounts={discounts}
                  copy={copy}
                  brandEyebrow={copy.brandEyebrow}
                />
              );
            })}
          </div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-10 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
            className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-14 text-slate-100 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.6)] sm:px-14 sm:py-20"
          >
            <div className="hero-grid pointer-events-none absolute inset-0 text-white opacity-[0.04]" />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-600/25 blur-3xl"
            />
            <div className="relative grid items-center gap-10 lg:grid-cols-[1.5fr_1fr]">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {copy.ctaEyebrow}
                </span>
                <h3 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                  {copy.ctaTitle}
                </h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                  {copy.ctaBody}
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 lg:ml-auto lg:max-w-xs">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200"
                >
                  {copy.ctaPrimary}
                </a>
                <a
                  href="mailto:ahmadjaelani8685@gmail.com"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
                >
                  {copy.ctaSecondary}
                </a>
                <p className="mt-1 text-center text-xs text-slate-500">{copy.ctaNote}</p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{copy.footerBrand}</p>
          <p>{copy.footerBody}</p>
        </div>
      </footer>

      <motion.a
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.03 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        transition={spring}
        href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20Anda"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:scale-105 hover:bg-[#1ebe5d]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.513 5.26l-.999 3.648 3.476-.907zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </span>
        <span className="hidden sm:inline">{copy.chat}</span>
      </motion.a>
    </div>
  );
}
