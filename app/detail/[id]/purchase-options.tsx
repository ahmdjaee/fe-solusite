"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "../../language-provider";
import { translations } from "../../lang";
import {
  CMS_CATEGORY,
  applyMarketingDiscount,
  formatPrice,
  getDynamicPrice,
  getStartingPrice,
  getStaticPrice,
} from "../../lib/data";
import type { Discount, Product } from "../../lib/data";

type PackageId = "static" | "dynamic";

export function PurchaseOptions({
  product,
  discount = null,
}: {
  product: Product;
  discount?: Discount | null;
}) {
  const { language } = useLanguage();
  const copy = translations[language].detail;
  const isCms = product.category === CMS_CATEGORY;
  const [selected, setSelected] = useState<PackageId>("dynamic");

  const packages = [
    {
      id: "static" as const,
      name: copy.staticName,
      tagline: copy.staticTagline,
      desc: copy.staticDesc,
      price: getStaticPrice(product),
      recommended: false,
    },
    {
      id: "dynamic" as const,
      name: copy.dynamicName,
      tagline: copy.dynamicTagline,
      desc: copy.dynamicDesc,
      price: getDynamicPrice(product),
      recommended: true,
    },
  ];

  const active = packages.find((pkg) => pkg.id === selected) ?? packages[0];

  // Harga final TETAP sesuai ketentuan; diskon hanya untuk harga coret (marketing).
  const activePricing = applyMarketingDiscount(active.price, discount);
  const singlePricing = applyMarketingDiscount(getStartingPrice(product), discount);

  // CMS: harga sesuai paket terpilih. Lainnya: harga produk.
  const orderPrice = isCms ? active.price : getStartingPrice(product);
  const orderLabel = isCms ? `${product.name} — paket ${active.name}` : product.name;

  const whatsappHref = `https://wa.me/6281234567890?text=${encodeURIComponent(
    `Halo, saya tertarik dengan produk ${orderLabel} (${formatPrice(orderPrice)}). Bisa dibantu?`,
  )}`;

  return (
    <div>
      {isCms ? (
        <>
          <h3 className="text-lg font-bold">{copy.choosePackage}</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{copy.chooseHint}</p>

          <div className="mt-4 grid gap-3">
            {packages.map((pkg) => {
              const isActive = pkg.id === selected;
              const pkgPricing = applyMarketingDiscount(pkg.price, discount);
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelected(pkg.id)}
                  aria-pressed={isActive}
                  className={`relative rounded-2xl border p-4 text-left transition ${
                    isActive
                      ? "border-brand-500 bg-brand-50/60 ring-2 ring-brand-200 dark:border-brand-500 dark:bg-brand-900/20 dark:ring-brand-900/50"
                      : "border-slate-200 bg-white hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                        isActive
                          ? "border-brand-600 bg-brand-600"
                          : "border-slate-300 dark:border-slate-600"
                      }`}
                    >
                      {isActive && <span className="h-2 w-2 rounded-full bg-white" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold">{pkg.name}</span>
                        {pkg.recommended && (
                          <span className="rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                            {copy.recommended}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm font-medium text-brand-700 dark:text-brand-300">
                        {pkg.tagline}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {pkg.desc}
                      </p>
                      <div className="mt-3 flex flex-wrap items-baseline gap-x-2">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                          {formatPrice(pkgPricing.finalPrice)}
                        </p>
                        {pkgPricing.savings > 0 && (
                          <>
                            <p className="text-sm font-semibold text-slate-400 line-through">
                              {formatPrice(pkgPricing.originalPrice)}
                            </p>
                            <span className="rounded-full bg-rose-500/95 px-2 py-0.5 text-[10px] font-semibold text-white">
                              {discount?.type === "percentage"
                                ? `${discount.value}% OFF`
                                : `${formatPrice(pkgPricing.savings)} OFF`}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-slate-400">
                {copy.selectedPackage}
              </p>
              <p className="text-sm font-semibold">{active.name}</p>
            </div>
            <div className="text-right">
              {activePricing.savings > 0 && (
                <p className="text-xs font-semibold text-slate-400 line-through">
                  {formatPrice(activePricing.originalPrice)}
                </p>
              )}
              <p className="text-2xl font-bold text-brand-600">
                {formatPrice(activePricing.finalPrice)}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-end justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-4 dark:bg-slate-800">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-400">{copy.startsFrom}</p>
            <div className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <p className="text-3xl font-bold text-brand-600">
                {formatPrice(singlePricing.finalPrice)}
              </p>
              {singlePricing.savings > 0 && (
                <p className="text-sm font-semibold text-slate-400 line-through">
                  {formatPrice(singlePricing.originalPrice)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center justify-center rounded-2xl bg-[#25D366] px-5 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-[#1ebe5d]"
      >
        {copy.orderViaWhatsapp}
      </a>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {product.demoUrl && (
          <a
            href={product.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-100 dark:border-brand-900/50 dark:bg-brand-900/20 dark:text-brand-300"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M10 4.5C5.8 4.5 2.3 7 1 10c1.3 3 4.8 5.5 9 5.5s7.7-2.5 9-5.5c-1.3-3-4.8-5.5-9-5.5zm0 9a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm0-2a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
            </svg>
            {copy.livePreview}
          </a>
        )}
        <Link
          href="/product"
          className={`inline-flex items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 ${
            product.demoUrl ? "" : "sm:col-span-2"
          }`}
        >
          {copy.viewOtherProducts}
        </Link>
      </div>
    </div>
  );
}
