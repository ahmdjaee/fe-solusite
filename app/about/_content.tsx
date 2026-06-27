"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "../language-provider";
import { getTranslations } from "../lang";
import { SiteHeader } from "../site-header";

function CmsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 4v5" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l8 3v6c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20s-7-4.5-9-9a4.5 4.5 0 018-3 4.5 4.5 0 018 3c-2 4.5-9 9-9 9z" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3h7l11 11-7 7L3 10z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

export default function AboutContent() {
  const { language } = useLanguage();
  const t = getTranslations(language);
  const a = t.about;
  const l = t.landing;

  const spring = { type: "spring" as const, stiffness: 120, damping: 18 };
  const fadeUp = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
  };

  const stats = [
    { value: a.stat1Value, label: a.stat1Label },
    { value: a.stat2Value, label: a.stat2Label },
    { value: a.stat3Value, label: a.stat3Label },
  ];

  const services = [
    { icon: <CmsIcon />, title: a.do1Title, body: a.do1Body },
    { icon: <GridIcon />, title: a.do2Title, body: a.do2Body },
    { icon: <SlidersIcon />, title: a.do3Title, body: a.do3Body },
  ];

  const values = [
    { icon: <SparkIcon />, title: a.value1Title, body: a.value1Body },
    { icon: <ShieldIcon />, title: a.value2Title, body: a.value2Body },
    { icon: <HeartIcon />, title: a.value3Title, body: a.value3Body },
    { icon: <TagIcon />, title: a.value4Title, body: a.value4Body },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-800 antialiased transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950" />
          <div className="hero-grid pointer-events-none absolute inset-0 opacity-[0.08] dark:opacity-[0.04]" />
          <div className="hero-blob-left pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full blur-3xl dark:opacity-20 dark:saturate-50" />
          <div className="hero-blob-right pointer-events-none absolute -right-20 top-10 h-96 w-96 rounded-full blur-3xl dark:opacity-20 dark:saturate-50" />

          <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
            <motion.span
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={spring}
              className="inline-flex items-center rounded-full border border-brand-200 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-700 backdrop-blur dark:border-brand-900/60 dark:bg-brand-900/20 dark:text-brand-300"
            >
              {a.heroEyebrow}
            </motion.span>
            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ ...spring, delay: 0.05 }}
              className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl"
            >
              {a.heroTitle}
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ ...spring, delay: 0.1 }}
              className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300"
            >
              {a.heroBody}
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ ...spring, delay: 0.15 }}
              className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-4"
            >
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="brand-card rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="text-2xl font-bold text-brand-600 sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Story */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={spring}
            className="brand-card grid gap-8 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-brand-50 to-white p-8 dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 lg:grid-cols-[0.8fr_1.2fr] lg:p-12"
          >
            <div>
              <p className="text-sm font-semibold text-brand-600">{a.storyEyebrow}</p>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{a.storyTitle}</h2>
            </div>
            <div className="space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
              <p>{a.storyBody1}</p>
              <p>{a.storyBody2}</p>
            </div>
          </motion.div>
        </section>

        {/* What we do */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-brand-600">{a.doEyebrow}</p>
            <h2 className="text-2xl font-bold sm:text-3xl">{a.doTitle}</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ ...spring, delay: index * 0.05 }}
                className="brand-card rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                  {item.icon}
                </span>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold text-brand-600">{a.valuesEyebrow}</p>
            <h2 className="text-2xl font-bold sm:text-3xl">{a.valuesTitle}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                transition={{ ...spring, delay: index * 0.05 }}
                className="brand-card rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {item.icon}
                </span>
                <h3 className="mt-4 text-base font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 py-12 pb-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
            className="relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950 px-6 py-14 text-center text-slate-100 shadow-[0_30px_80px_-20px_rgba(2,6,23,0.6)] sm:px-14 sm:py-16"
          >
            <div className="hero-grid pointer-events-none absolute inset-0 text-white opacity-[0.04]" />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-600/25 blur-3xl"
            />
            <div className="relative">
              <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                {a.ctaTitle}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                {a.ctaBody}
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 sm:w-auto"
                >
                  {a.ctaPrimary}
                </a>
                <Link
                  href="/product"
                  className="inline-flex w-full items-center justify-center rounded-xl border border-slate-700 px-6 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900 sm:w-auto"
                >
                  {a.ctaSecondary}
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-500 dark:text-slate-400 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>{l.footerBrand}</p>
          <p>{l.footerBody}</p>
        </div>
      </footer>
    </div>
  );
}
