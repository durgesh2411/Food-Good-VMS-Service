import i18next from "i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18next.use(LanguageDetector).use(initReactI18next).use(HttpBackend).init({
  // debug: true,
  lng: "en",
  returnObjects: true,
});
