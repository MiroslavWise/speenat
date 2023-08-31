import Image from "next/image"
import { useState, type FC } from "react"
import { useTranslation } from "react-i18next"
import { motion } from "framer-motion"

import { FLAGS_LANGUAGE } from "./constants"

import { useAntdLang } from "context/LanguageContext"

import changeLanguage from "helpers/changeLanguage"
import { cx } from "functions/cx"

import styles from "./style.module.scss"

export const LanguagesOpenButton: FC<{ className?: string }> = ({
    className,
}) => {
    const { i18n } = useTranslation()
    const [visible, setVisible] = useState(false)

    const { changeLanguage: setLang } = useAntdLang()

    const handleLanguage = (value: "ru" | "en" | "kz") => {
        changeLanguage(value, i18n, setLang)
    }

    return (
        <>
            <motion.ul
                className={cx(
                    styles.containerArrow,
                    visible && styles.active,
                    className,
                )}
                onClick={() => {
                    setVisible((prev) => !prev)
                }}
                layout
                data-is-open={visible}
                initial={{ borderRadius: 50 }}
            >
                {visible ? (
                    FLAGS_LANGUAGE.map((item) => (
                        <li
                            key={`${item.value}_${item.icon}`}
                            onClick={() => handleLanguage(item.value)}
                            className={cx(
                                i18n.language === item.value && styles.active,
                            )}
                        >
                            <h1>{item.icon}</h1>
                        </li>
                    ))
                ) : FLAGS_LANGUAGE.find(
                    (item) => item?.value === i18n.language,
                ) ? (
                    <h1>
                        {
                            FLAGS_LANGUAGE.find(
                                (item) => item?.value === i18n.language,
                            )?.icon!
                        }
                    </h1>
                ) : null}
            </motion.ul>
        </>
    )
}
