import i18nPlugin from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import en from "constant/languages/en"
import kz from "constant/languages/kz"
import ru from "constant/languages/ru"

export default i18nPlugin
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ru: { translations: ru },
            en: { translations: en },
            kz: { translations: kz },
        },
        fallbackLng: "kz",
        keySeparator: false,
        supportedLngs: ["ru", "en", "kz"],
        ns: ["translations"],
        defaultNS: "translations",
        interpolation: {
            escapeValue: false,
        },
    })
