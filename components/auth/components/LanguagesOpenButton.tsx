import Image from "next/image"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { FLAGS_LANGUAGE } from "./constants"

import { useAntdLang } from "context/LanguageContext"

import changeLanguage from "helpers/changeLanguage";
import { cx } from "functions/cx"

import styles from "./style.module.scss"

export const LanguagesOpenButton = () => {
  const { i18n } = useTranslation()
  const [visible, setVisible] = useState(false)

  const { changeLanguage: setLang } = useAntdLang()

  const handleLanguage = (value: "ru" | "en" | "kz") => {
    changeLanguage(value, i18n, setLang)
    setVisible(false)
  }

  return (
    <>
      <div className={cx(styles.containerArrow, visible && styles.active)} onClick={() => { setVisible(prev => !prev) }}>
        <Image
          src="/svg/chevron-selector-horizontal.svg"
          width={20}
          height={20}
          alt="left"
        />
      </div>
      <ul className={cx(styles.containerLanguages, visible && styles.active)}>
        {
          FLAGS_LANGUAGE.map(item => (
            <li
              key={`${item.value}_${item.icon}`}
              onClick={() => handleLanguage(item.value)}
              className={cx(i18n.language === item.value && styles.active)}
            >
              <Image
                src={item?.icon}
                alt="fl"
                height={50}
                width={50}
                className={styles["img-flag"]}
              />
            </li>
          ))
        }
      </ul>
    </>
  )
}