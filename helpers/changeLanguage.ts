import { i18n as i18nModel } from "i18next"

import { AntdLanguage } from "context/LanguageContext"

const changeLanguage = (
    lng: string,
    i18n: i18nModel,
    setLang: AntdLanguage["changeLanguage"],
) => {
    i18n.changeLanguage(lng)
    setLang(lng)
}

export default changeLanguage
