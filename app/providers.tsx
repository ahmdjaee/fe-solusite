"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { LanguageProvider } from "./language-provider";
import { SettingsProvider } from "./settings-provider";
import type { Language } from "./lang/config";
import type { Settings } from "./lib/data";

export function Providers({
  children,
  initialLanguage,
  initialTheme,
  settings,
}: {
  children: ReactNode;
  initialLanguage?: Language;
  initialTheme?: "light" | "dark";
  settings: Settings;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider settings={settings}>
        <LanguageProvider initialLanguage={initialLanguage}>
          <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
        </LanguageProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
