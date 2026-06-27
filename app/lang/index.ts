import { about as enAbout } from "./en/about";
import { common as enCommon } from "./en/common";
import { detail as enDetail } from "./en/detail";
import { landing as enLanding } from "./en/landing";
import { about as idAbout } from "./id/about";
import { common as idCommon } from "./id/common";
import { detail as idDetail } from "./id/detail";
import { landing as idLanding } from "./id/landing";
import type { Language, LocalizedString } from "./config";

export { defaultLanguage, isLanguage, languages } from "./config";
export type { Language, LocalizedString } from "./config";

export const translations = {
  id: {
    common: idCommon,
    detail: idDetail,
    landing: idLanding,
    about: idAbout,
  },
  en: {
    common: enCommon,
    detail: enDetail,
    landing: enLanding,
    about: enAbout,
  },
} as const;

function localizeSection<T extends Record<string, string>>(
  id: T,
  en: { [Key in keyof T]: string },
) {
  return (Object.keys(id) as Array<keyof T>).reduce(
    (copy, key) => {
      copy[key] = { id: id[key], en: en[key] };
      return copy;
    },
    {} as { [Key in keyof T]: LocalizedString },
  );
}

export function getTranslations(language: Language) {
  return translations[language];
}

export const localizedText = {
  detail: localizeSection(idDetail, enDetail),
};
