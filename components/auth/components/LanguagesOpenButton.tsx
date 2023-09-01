import { useState, type FC } from "react"
import { useTranslation } from "react-i18next"

import { FLAGS_LANGUAGE } from "./constants"

import { useAntdLang } from "context/LanguageContext"

import changeLanguage from "helpers/changeLanguage"
import { cx } from "functions/cx"

import styles from "./style.module.scss"

export const LanguagesOpenButton: FC<{ className?: string }> = ({
    className,
}) => {
    const { i18n } = useTranslation()
    const [active, setActive] = useState(false)
    const { changeLanguage: setLang } = useAntdLang()
    function handleLanguage(value: "ru" | "en" | "kz") { changeLanguage(value, i18n, setLang) }
    function handleVisible(){setActive(prev => !prev)}
    return (
        <div className={cx(styles.container, active && styles.active)}>
            <span onClick={handleVisible}>{FLAGS_LANGUAGE.find(item => item.value === i18n.language)?.label}</span>
            <ul onClick={handleVisible}>
                {FLAGS_LANGUAGE.map(item => (
                    <li key={`${item.value}_li_lang`} onClick={() => handleLanguage(item.value)}>
                        {item.label}
                    </li>
                ))}
            </ul>
        </div>
    )
}
