"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  fetchProducts,
  fetchPortfolio,
  fetchPlans,
  fetchServices,
  fetchDiscounts,
  filterProducts,
  filterServices,
  formatPrice,
  getProductPricing,
} from "./lib/data";
import type { Discount, Plan, PortfolioItem, Product, Service } from "./lib/data";
import Link from "next/link";
import { useTheme } from "./theme-provider";
import type { LandingData } from "./lib/server-data";
import { useLanguage } from "./language-provider";
import { LanguageToggleButton } from "./localized-text";
import { getTranslations } from "./lang";

type HomeContentProps = {
  initialData: LandingData;
};

function hasData<T>(items: T[]) {
  return items.length > 0 ? items : undefined;
}

export default function HomeContent({ initialData }: HomeContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const copy = getTranslations(language).landing;
  const darkMode = theme === "dark";
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

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

  const {
    data: services = [],
    isLoading: servicesLoading,
    isError: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
    initialData: hasData<Service>(initialData.services),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: portfolio = [],
    isLoading: portfolioLoading,
    isError: portfolioError,
  } = useQuery({
    queryKey: ["portfolio"],
    queryFn: fetchPortfolio,
    initialData: hasData<PortfolioItem>(initialData.portfolio),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: plans = [],
    isLoading: plansLoading,
    isError: plansError,
  } = useQuery({
    queryKey: ["plans"],
    queryFn: fetchPlans,
    initialData: hasData<Plan>(initialData.plans),
    staleTime: 1000 * 60 * 5,
  });

  const { data: discounts = [] } = useQuery({
    queryKey: ["discounts"],
    queryFn: fetchDiscounts,
    initialData: hasData<Discount>(initialData.discounts),
    staleTime: 1000 * 60 * 5,
  });

  const dataLoading = productsLoading || servicesLoading || portfolioLoading || plansLoading;
  const dataError = productsError || servicesError || portfolioError || plansError;
  const featuredProduct = products[0] ?? null;
  const featuredPricing = featuredProduct ? getProductPricing(featuredProduct, discounts) : null;

  const filteredProducts = useMemo(
    () => filterProducts(products, search, selectedCategory, selectedType),
    [products, search, selectedCategory, selectedType],
  );

  const filteredServices = useMemo(
    () => filterServices(services, search, selectedCategory, selectedType),
    [services, search, selectedCategory, selectedType],
  );

  const motionDistance = prefersReducedMotion ? 0 : 18;
  const spring = { type: "spring" as const, stiffness: 120, damping: 18 };
  const fadeUp = {
    hidden: { opacity: 0, y: motionDistance },
    show: { opacity: 1, y: 0 },
  };
  const subtleScale = prefersReducedMotion ? 1 : 0.97;
  const cardMotion = {
    hidden: { opacity: 0, y: motionDistance, scale: subtleScale },
    show: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : 8, scale: subtleScale },
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
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#home" className="flex items-center gap-3">
            <div className="brand-shadow flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              S
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{copy.brandEyebrow}</p>
              <p className="hidden text-base font-semibold sm:block sm:text-lg">
                {copy.brandTitle}
              </p>
            </div>
          </a>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#products"
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
            >
              {copy.navProducts}
            </a>
            <a
              href="#services"
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
            >
              {copy.navServices}
            </a>
            <a
              href="#portfolio"
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
            >
              {copy.navPortfolio}
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
            >
              {copy.navPricing}
            </a>
            <button
              onClick={toggleTheme}
              aria-label={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
              aria-pressed={darkMode}
              suppressHydrationWarning
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium hover:border-brand-300 hover:text-brand-600 dark:border-slate-700"
              type="button"
            >
              <span suppressHydrationWarning>{darkMode ? copy.light : copy.dark}</span>
            </button>
            <LanguageToggleButton />
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              aria-label={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
              aria-pressed={darkMode}
              suppressHydrationWarning
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
            <LanguageToggleButton />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {mobileMenu && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: "easeOut" }}
              className="overflow-hidden border-t border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 md:hidden"
            >
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="flex flex-col gap-3 py-4"
              >
                {[
                  [copy.navProducts, "#products"],
                  [copy.navServices, "#services"],
                  [copy.navPortfolio, "#portfolio"],
                  [copy.navPricing, "#pricing"],
                ].map(([label, href]) => (
                  <motion.a
                    key={href}
                    variants={fadeUp}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    onClick={() => setMobileMenu(false)}
                    href={href}
                    className="text-sm font-medium"
                  >
                    {label}
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {dataError && (
          <section className="border-b border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300 sm:px-6 lg:px-8">
            {copy.apiError}
          </section>
        )}
        <section id="home" className="relative overflow-hidden">
          <div className="hero-blob-left pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full blur-3xl" />
          <div className="hero-blob-right pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full blur-3xl" />
          <div className="hero-blob-bottom pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full blur-3xl" />
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.06]" />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950" />

          <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="flex flex-col justify-center"
            >
              <motion.span
                variants={fadeUp}
                transition={spring}
                className="mb-4 inline-flex w-fit items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-900/60 dark:bg-brand-900/30 dark:text-brand-300"
              >
                {copy.heroBadge}{" "}
              </motion.span>
              <motion.h1
                variants={fadeUp}
                transition={spring}
                className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
              >
                {copy.heroTitle}
              </motion.h1>
              <motion.p
                variants={fadeUp}
                transition={spring}
                className="mt-4 max-w-xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base"
              >
                {copy.heroBody}
              </motion.p>
              <motion.div variants={fadeUp} transition={spring} className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#products"
                  className="brand-shadow rounded-2xl bg-brand-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  {copy.viewProducts}
                </a>
                <a
                  href="#services"
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                >
                  {copy.viewServices}
                </a>
              </motion.div>
              <motion.div variants={stagger} className="mt-8 grid grid-cols-3 gap-3">
                <motion.div variants={cardMotion} transition={spring} className="brand-card rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-2xl font-bold text-brand-600">
                    {dataLoading ? "..." : products.length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{copy.digitalProducts}</p>
                </motion.div>
                <motion.div variants={cardMotion} transition={spring} className="brand-card rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-2xl font-bold text-brand-600">
                    {dataLoading ? "..." : services.length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{copy.services}</p>
                </motion.div>
                <motion.div variants={cardMotion} transition={spring} className="brand-card rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-2xl font-bold text-brand-600">
                    {dataLoading
                      ? "..."
                      : discounts.filter((discount) => discount.currentlyActive ?? discount.isActive).length}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{copy.activePromos}</p>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid gap-4 sm:grid-cols-2"
            >
              <motion.div variants={cardMotion} transition={spring} className="brand-card rounded-3xl border border-brand-100 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                      {copy.featuredProduct}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">
                      {featuredProduct?.name ?? "Menunggu data produk"}
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {featuredProduct?.short ?? copy.waitingFeatured}
                    </p>
                  </div>
                  <span className="rounded-full text-nowrap bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {featuredPricing?.discount?.code ?? (featuredProduct ? copy.bestSeller : "API")}
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(featuredProduct?.tags.length
                    ? featuredProduct.tags.slice(0, 4)
                    : ["API", "Laravel", language === "id" ? "Publik" : "Public", language === "id" ? "Halaman Awal" : "Landing"]).map((tag) => (
                    <div key={tag} className="rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-800">
                      {tag}
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={cardMotion} transition={spring} className="brand-card rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {copy.management}
                </p>
                <h3 className="mt-2 text-lg font-bold">{copy.managementTitle}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {copy.managementBody}
                </p>
              </motion.div>
              <motion.div variants={cardMotion} transition={spring} className="brand-card rounded-3xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
                  {copy.scalable}
                </p>
                <h3 className="mt-2 text-lg font-bold">{copy.scalableTitle}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {copy.scalableBody}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={fadeUp}
          transition={spring}
          className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        >
          <div className="brand-card rounded-3xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-lg font-bold">{copy.searchTitle}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {copy.searchBody}
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3 lg:w-2/3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder={copy.searchPlaceholder}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950"
                />
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-brand-900/40"
                  >
                    <option value="all">{copy.allCategories}</option>
                    <option value="app">{copy.apps}</option>
                    <option value="source-code">{copy.sourceCode}</option>
                    <option value="service">{copy.navServices}</option>
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full cursor-pointer appearance-none rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-brand-900/40"
                  >
                    <option value="all">{copy.allStatuses}</option>
                    <option value="ready">{copy.readyProduct}</option>
                    <option value="custom">{copy.customService}</option>
                  </select>
                  <svg
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <section id="products" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand-600">{copy.digitalProducts}</p>
              <h3 className="text-2xl font-bold">{copy.appsAndSource}</h3>
            </div>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {filteredProducts.length} {copy.itemCount}
            </span>
          </div>

          <motion.div layout className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => {
                const pricing = getProductPricing(product, discounts);

                return (
              <motion.article
                key={product.id}
                layout
                variants={cardMotion}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={spring}
                className="brand-card group overflow-hidden rounded-[30px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <a href={`/detail/${product.id}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={product.thumbnailUrl}
                      alt={`Preview ${product.name} dari ${copy.brandEyebrow}`}
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
                      {pricing.savings > 0 && (
                        <span className="rounded-full bg-rose-500/95 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
                          {pricing.discount?.type === "percentage"
                            ? `${pricing.discount.value}% OFF`
                            : `${formatPrice(pricing.savings)} OFF`}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">
                        {copy.digitalProduct}
                      </p>
                      <h4 className="mt-2 text-xl font-bold leading-tight text-white">
                        {product.name}
                      </h4>
                    </div>
                  </div>
                </a>
                <div className="p-5">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {product.short}
                  </p>
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
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        {pricing.discount
                          ? `Promo ${pricing.discount.code}`
                          : pricing.savings > 0
                            ? copy.activePromo
                            : copy.startsFrom}
                      </p>
                      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">
                          {formatPrice(pricing.finalPrice)}
                        </p>
                        {pricing.savings > 0 && (
                          <p className="text-sm font-semibold text-slate-400 line-through">
                            {formatPrice(pricing.originalPrice)}
                          </p>
                        )}
                      </div>
                      {pricing.savings > 0 && (
                        <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-300">
                          {copy.save} {formatPrice(pricing.savings)}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/detail/${product.id}`}
                      className="brand-shadow rounded-2xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      {copy.detail}
                    </Link>
                  </div>
                </div>
              </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="services" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-brand-600">{copy.developerServices}</p>
            <h3 className="text-2xl font-bold">{copy.servicesTitle}</h3>
          </div>
          <motion.div layout className="grid gap-4 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                layout
                variants={cardMotion}
                initial="hidden"
                animate="show"
                exit="exit"
                transition={spring}
                className="brand-card rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-lg font-bold">{service.name}</h4>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                    {service.level}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {service.description}
                </p>
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">{copy.startsFrom}</p>
                    <p className="text-lg font-bold text-brand-600">{formatPrice(service.price)}</p>
                  </div>
                  <a
                    href="https://wa.me/6281234567890"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200"
                  >
                    {copy.order}
                  </a>
                </div>
              </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </section>

        <section id="portfolio" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={spring}
            className="brand-card rounded-3xl border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-6 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950"
          >
            <div className="mb-6">
              <p className="text-sm font-semibold text-brand-600">{copy.portfolioEyebrow}</p>
              <h3 className="text-2xl font-bold">{copy.portfolioTitle}</h3>
            </div>
            <motion.div variants={stagger} className="grid gap-4 md:grid-cols-3">
              {portfolioLoading &&
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="min-h-44 animate-pulse rounded-3xl border border-white/70 bg-white/80 p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="h-5 w-2/3 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-4 h-3 w-full rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-2 h-3 w-5/6 rounded bg-slate-200 dark:bg-slate-700" />
                    <div className="mt-6 flex gap-2">
                      <div className="h-7 w-20 rounded-full bg-slate-200 dark:bg-slate-700" />
                      <div className="h-7 w-24 rounded-full bg-slate-200 dark:bg-slate-700" />
                    </div>
                  </div>
                ))}

              {!portfolioLoading && portfolioError && (
                <div className="md:col-span-3 rounded-3xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
                  {copy.portfolioError}
                </div>
              )}

              {!portfolioLoading && !portfolioError && portfolio.length === 0 && (
                <div className="md:col-span-3 rounded-3xl border border-slate-200 bg-white p-5 text-sm font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                  {copy.portfolioEmpty}
                </div>
              )}

              {!portfolioLoading &&
                !portfolioError &&
                portfolio.map((item) => (
                  <motion.div
                    key={item.id}
                    variants={cardMotion}
                    transition={spring}
                    className="brand-card rounded-3xl border border-white/70 bg-white p-5 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <h4 className="text-lg font-bold">{item.name}</h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {item.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full bg-slate-100 px-3 py-1 text-xs dark:bg-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          </motion.div>
        </section>

        <section id="pricing" className="mx-auto max-w-7xl px-4 py-8 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-brand-600">{copy.pricingEyebrow}</p>
            <h3 className="text-2xl font-bold">{copy.pricingTitle}</h3>
          </div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid gap-4 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                variants={cardMotion}
                transition={spring}
                className={`brand-card rounded-3xl border bg-white p-6 dark:bg-slate-900 ${
                  plan.highlight
                    ? "border-brand-500 ring-2 ring-brand-200 dark:ring-brand-900/50"
                    : "border-slate-200 dark:border-slate-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-xl font-bold">{plan.name}</h4>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {plan.description}
                    </p>
                  </div>
                  {plan.highlight && (
                    <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                      {copy.popular}
                    </span>
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
                  {copy.choosePlan}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 24 }}
            whileInView={{ opacity: 1, y: 0 }}
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
                  href="mailto:hello@solusite.studio"
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
        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.03 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
        transition={spring}
        href="https://wa.me/6281234567890?text=Halo%2C%20saya%20tertarik%20dengan%20produk%20dan%20jasa%20developer%20Anda"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-2xl transition hover:scale-105 hover:bg-[#1ebe5d]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zM6.597 20.13c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.513 5.26l-.999 3.648 3.476-.907zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </span>
        <span className="hidden sm:inline">{copy.chat}</span>
      </motion.a>
    </div>
  );
}
