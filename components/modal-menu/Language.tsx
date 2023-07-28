import { FC } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";

import { useAntdLang } from "context/LanguageContext"
import changeLanguage from "helpers/changeLanguage";

interface ILangFlags{
        value: "ru" | "kz" | "en"
        icon: string
}

const FLAGS_LANGUAGE: ILangFlags[] = [
        {
                value: "ru",
                icon: "/svg/flags/ru.svg",
        },
        {
                value: "kz",
                icon: "/svg/flags/kz.svg",
        },
        {
                value: "en",
                icon: "/svg/flags/us.svg",
        }
]

const LanguageButtons: FC = () => {
        const { i18n } = useTranslation()

        const { changeLanguage: setLang } = useAntdLang()

        const handleLanguage = (value: "ru" | "en" | "kz") => {
                changeLanguage(value, i18n, setLang)
        }

        return (
                <div className="flags-container">
                        {
                                FLAGS_LANGUAGE.map(item => (
                                        <div
                                                className={`item-flag ${i18n.language === item.value && "active"}`} 
                                                key={`${item?.value}_flag`}
                                                onClick={() => handleLanguage(item.value)}
                                        >
                                                <Image
                                                        src={item?.icon}
                                                        alt="fl"
                                                        height={50}
                                                        width={50}
                                                        className="img-flag"
                                                />
                                        </div>
                                ))
                        }
                </div>
        )
}

export default LanguageButtons