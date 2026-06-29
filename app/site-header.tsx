"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "./language-provider";
import { useSettings } from "./settings-provider";
import { LanguageToggleButton, ThemeToggleButton } from "./localized-text";
import { getTranslations } from "./lang";

export function SiteHeader() {
  const prefersReducedMotion = useReducedMotion();
  const { language } = useLanguage();
  const settings = useSettings();
  const copy = getTranslations(language).landing;
  const [mobileMenu, setMobileMenu] = useState(false);

  const navItems: Array<{ label: string; href: string }> = [
    { label: copy.navProducts, href: "/#products" },
    { label: copy.navContact, href: "/#contact" },
    { label: copy.navAbout, href: "/about" },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    show: { opacity: 1, y: 0 },
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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.siteName}
              className="h-10 w-10 rounded-2xl object-cover"
            />
          ) : (
            <div className="brand-shadow flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-lg font-bold text-white">
              {settings.siteName.charAt(0) || "S"}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {settings.siteName}
            </p>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              {settings.tagline}
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggleButton />
          <LanguageToggleButton />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggleButton compact />
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
              {navItems.map((item) => (
                <motion.div
                  key={item.href}
                  variants={fadeUp}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenu(false)}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
