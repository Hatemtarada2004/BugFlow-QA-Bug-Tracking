import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import ar from "./locales/ar";

const savedLang = localStorage.getItem("lang") ?? "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// Apply RTL direction on init
document.documentElement.dir = savedLang === "ar" ? "rtl" : "ltr";
document.documentElement.lang = savedLang;

export const toggleLanguage = () => {
  const next = i18n.language === "en" ? "ar" : "en";
  i18n.changeLanguage(next);
  localStorage.setItem("lang", next);
  document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  document.documentElement.lang = next;
};

export default i18n;
