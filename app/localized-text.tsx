"use client";

import { useLanguage } from "./language-provider";
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
