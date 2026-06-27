"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { ThemeProvider } from "./theme-provider";
import { LanguageProvider } from "./language-provider";
import type { Language } from "./lang/config";

export function Providers({
  children,
  initialLanguage,
  initialTheme,
}: {
  children: ReactNode;
  initialLanguage?: Language;
  initialTheme?: "light" | "dark";
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider initialLanguage={initialLanguage}>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
