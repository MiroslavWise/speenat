import { ConfigProvider } from "antd"
import en from "antd/locale/en_GB"
import kz from "antd/locale/kk_KZ"
import ru from "antd/locale/ru_RU"
import "moment/locale/en-gb"
import "moment/locale/kk"
import "moment/locale/ru"
import React, { Dispatch, FC, useState } from "react"
import { useTranslation } from "react-i18next"

export interface AntdLanguage {
    language: any

    changeLanguage: Dispatch<string>
}

const AntdLanguageContext = React.createContext<AntdLanguage | undefined>(
    undefined,
)

const antdLangMap = { en, ru, kz } as Record<string, any>

const AntdLanguageProvider: FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const { i18n } = useTranslation()
    const [language, setLanguage] = useState(antdLangMap[i18n.language] || kz)

    const changeLanguage = (lang: string) =>
        setLanguage(antdLangMap?.[lang] || kz)

    return (
        <AntdLanguageContext.Provider value={{ language, changeLanguage }}>
            <ConfigProvider locale={language}>{children}</ConfigProvider>
        </AntdLanguageContext.Provider>
    )
}

const useAntdLang = () => {
    const context = React.useContext(AntdLanguageContext)

    if (context === undefined) {
        throw new Error(
            "useAntdLang must be used within a AntdLanguageProvider",
        )
    }

    return context
}

export { AntdLanguageContext, AntdLanguageProvider, useAntdLang }
