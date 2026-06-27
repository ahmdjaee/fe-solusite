"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const THEME_STORAGE_KEY = "theme";
const THEME_COOKIE_KEY = "theme";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function writeThemeCookie(theme: Theme) {
  document.cookie = `${THEME_COOKIE_KEY}=${theme}; path=/; max-age=31536000; samesite=lax`;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({
  children,
  initialTheme = "light",
}: {
  children: ReactNode;
  initialTheme?: Theme;
}) {
  // initialTheme berasal dari cookie (dibaca server) agar tidak ada flash bagi
  // pengunjung yang pernah memilih tema.
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  // Saat pertama di klien: selaraskan dengan preferensi tersimpan / sistem
  // (penting untuk kunjungan pertama yang belum punya cookie).
  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    setThemeState(isTheme(stored) ? stored : getSystemTheme());
  }, []);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    writeThemeCookie(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleSystemThemeChange() {
      if (isTheme(window.localStorage.getItem(THEME_STORAGE_KEY))) return;
      setThemeState(getSystemTheme());
    }

    function handleStorageChange(event: StorageEvent) {
      if (event.key !== THEME_STORAGE_KEY) return;
      setThemeState(isTheme(event.newValue) ? event.newValue : getSystemTheme());
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme: setThemeState,
      toggleTheme: () =>
        setThemeState((currentTheme) => (currentTheme === "dark" ? "light" : "dark")),
    }),
    [theme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
