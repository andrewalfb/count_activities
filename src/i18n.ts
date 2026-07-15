
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./translation/en.json";
import fr from "./translation/fr.json";
import hy from "./translation/hy.json";

const resources = {
  en: {
    translation: en,
  },
  fr: {
    translation: fr,
  },
  hy: {
    translation: hy,
  },
}

const defaultNS = "translation" as const;

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    ns: [defaultNS],
    defaultNS,
  });

export default i18n;
