"use client";

import { useLanguage } from "./language-provider";
import { useTheme } from "./theme-provider";
import { translations } from "./lang";
import type { LocalizedString } from "./lang/config";

type LocalizedTextProps = {
  text: LocalizedString;
};

export function LocalizedText({ text }: LocalizedTextProps) {
  const { language } = useLanguage();

  return <>{text[language]}</>;
}

function GlobeIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.2 2.5 3.4 5.5 3.4 9S14.2 18.5 12 21" />
      <path d="M12 3c-2.2 2.5-3.4 5.5-3.4 9S9.8 18.5 12 21" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function ThemeToggleButton({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const copy = translations[language].landing;
  const dark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={dark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
      aria-pressed={dark}
      suppressHydrationWarning
      type="button"
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700"
    >
      <span suppressHydrationWarning className="flex h-4 w-4 items-center justify-center text-amber-500 dark:text-amber-300">
        {dark ? <SunIcon /> : <MoonIcon />}
      </span>
      {!compact && <span suppressHydrationWarning>{dark ? copy.light : copy.dark}</span>}
    </button>
  );
}

export function LanguageToggleButton() {
  const { language, toggleLanguage } = useLanguage();
  const copy = translations[language].common;

  return (
    <button
      onClick={toggleLanguage}
      aria-label={copy.languageToggle}
      className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium transition hover:border-brand-300 hover:text-brand-600 dark:border-slate-700"
      type="button"
    >
      <GlobeIcon />
      <span>{copy.nextLanguage}</span>
    </button>
  );
}
