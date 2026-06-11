"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultLanguage, isLanguage, type Language } from "./lang/config";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LANGUAGE_STORAGE_KEY = "language";
const LANGUAGE_COOKIE_KEY = "language";
const LanguageContext = createContext<LanguageContextValue | null>(null);

function writeLanguageCookie(language: Language) {
  document.cookie = `${LANGUAGE_COOKIE_KEY}=${language}; path=/; max-age=31536000; samesite=lax`;
}

function applyLanguage(language: Language) {
  document.documentElement.lang = language;
}

function persistLanguage(language: Language) {
  applyLanguage(language);
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  writeLanguageCookie(language);
}

export function LanguageProvider({
  children,
  initialLanguage = defaultLanguage,
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    persistLanguage(language);
  }, [language]);

  const setLanguage = useCallback((language: Language) => {
    persistLanguage(language);
    setLanguageState(language);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((current) => {
      const nextLanguage = current === "id" ? "en" : "id";

      persistLanguage(nextLanguage);

      return nextLanguage;
    });
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function getStoredLanguage(value: string | null | undefined): Language {
  return isLanguage(value) ? value : defaultLanguage;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage harus digunakan di dalam LanguageProvider");
  }

  return context;
}
