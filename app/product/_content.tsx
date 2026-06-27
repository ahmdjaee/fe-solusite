"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  fetchProducts,
  fetchDiscounts,
  fetchCategories,
  formatPrice,
  getMarketingPricing,
} from "../lib/data";
import type { Category, Discount, Product } from "../lib/data";
import { useLanguage } from "../language-provider";
import { LanguageToggleButton, ThemeToggleButton } from "../localized-text";
import { getTranslations } from "../lang";

type Copy = ReturnType<typeof getTranslations>["landing"];

type ProductListContentProps = {
  initialProducts: Product[];
  initialDiscounts: Discount[];
  initialCategories: Category[];
  initialCategory: string;
};

function hasData<T>(items: T[]) {
  return items.length > 0 ? items : undefined;
}

function categoryLabel(category: Category, copy: Copy) {
  if (category.slug === "cms") return copy.categoryCms;
  if (category.slug === "others") return copy.categoryOthers;
  return category.name;
}

function ProductGridCard({
  product,
  discounts,
  copy,
}: {
  product: Product;
  discounts: Discount[];
  copy: Copy;
}) {
  const pricing = getMarketingPricing(product, discounts);
  const showDiscount = pricing.savings > 0;

  return (
    <article className="brand-card group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <Link href={`/detail/${product.id}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={product.thumbnailUrl}
            alt={`Preview ${product.name}`}
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
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-tight">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          {product.short}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">
              {showDiscount ? copy.activePromo : copy.startsFrom}
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
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
            className="brand-shadow shrink-0 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {copy.detail}
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ProductListContent({
  initialProducts,
  initialDiscounts,
  initialCategories,
  initialCategory,
}: ProductListContentProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const copy = getTranslations(language).landing;

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    initialData: hasData<Product>(initialProducts),
    staleTime: 1000 * 60 * 5,
  });

  const { data: discounts = [] } = useQuery({
    queryKey: ["discounts"],
    queryFn: fetchDiscounts,
    initialData: hasData<Discount>(initialDiscounts),
    staleTime: 1000 * 60 * 5,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    initialData: hasData<Category>(initialCategories),
    staleTime: 1000 * 60 * 5,
  });

  // Kategori dari API, urut sortOrder (CMS paling depan).
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder),
    [categories],
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((product) => {
      const matchCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchSearch =
        !keyword ||
        product.name.toLowerCase().includes(keyword) ||
        product.short.toLowerCase().includes(keyword) ||
        product.description.toLowerCase().includes(keyword);
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, search]);

  function selectCategory(slug: string) {
    setSelectedCategory(slug);
    const href = slug === "all" ? "/product" : `/product?category=${slug}`;
    router.replace(href, { scroll: false });
  }

  const chips: Array<{ slug: string; label: string }> = [
    { slug: "all", label: copy.allCategoriesChip },
    ...sortedCategories.map((category) => ({
      slug: category.slug,
      label: categoryLabel(category, copy),
    })),
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="brand-shadow flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              S
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{copy.brandEyebrow}</p>
              <p className="hidden text-base font-semibold sm:block sm:text-lg">
                {copy.productPageTitle}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggleButton />
            <LanguageToggleButton />
            <Link
              href="/"
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:border-brand-300 hover:text-brand-600 dark:border-slate-700"
            >
              {copy.backHome}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold text-brand-600">{copy.productsEyebrow}</p>
          <h1 className="text-2xl font-bold sm:text-3xl">{copy.productPageTitle}</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            {copy.productPageBody}
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {chips.map((chip) => {
              const active = selectedCategory === chip.slug;
              return (
                <button
                  key={chip.slug}
                  type="button"
                  onClick={() => selectCategory(chip.slug)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}
          </div>

          <div className="relative lg:w-72">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              type="text"
              placeholder={copy.searchPlaceholder}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-400 dark:border-slate-700 dark:bg-slate-950"
            />
          </div>
        </div>

        <div className="mb-4 text-sm text-slate-500 dark:text-slate-400">
          {filteredProducts.length} {copy.itemCount}
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            {copy.noResults}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductGridCard
                key={product.id}
                product={product}
                discounts={discounts}
                copy={copy}
              />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{copy.footerBrand}</p>
          <p>{copy.footerBody}</p>
        </div>
      </footer>
    </div>
  );
}
