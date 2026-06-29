"use client";

import { createContext, ReactNode, useContext } from "react";
import type { Settings } from "./lib/data";

const SettingsContext = createContext<Settings | null>(null);

export function SettingsProvider({
  children,
  settings,
}: {
  children: ReactNode;
  settings: Settings;
}) {
  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings(): Settings {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useSettings must be used inside SettingsProvider");
  }

  return context;
}
