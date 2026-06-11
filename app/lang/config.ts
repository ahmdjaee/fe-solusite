export const languages = ["id", "en"] as const;

export type Language = (typeof languages)[number];
export type LocalizedString = Record<Language, string>;

export const defaultLanguage: Language = "id";

export function isLanguage(value: string | null | undefined): value is Language {
  return languages.includes(value as Language);
}
