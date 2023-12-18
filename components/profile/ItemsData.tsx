import Link from "next/link"
import { FC, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Modal } from "antd/lib"

import { FLAGS_LANGUAGE } from "components/auth/components/constants"
import { useUser } from "store/use-user"
import { useAntdLang } from "context/LanguageContext"
import changeLanguage from "helpers/changeLanguage"

import styles from "./style.module.scss"

export const ItemsData: FC = () => {
    const { t, i18n } = useTranslation()
    const { changeLanguage: setLang } = useAntdLang()
    const handleLanguage = (value: "ru" | "en" | "kz") => {
        changeLanguage(value, i18n, setLang)
        setActive(false)
    }
    const { push } = useRouter()
    const [active, setActive] = useState(false)
    const user = useUser((state) => state.user)
    const isStaff = useUser((state) => state?.user?.profile?.is_accountant)

    return (
        <>
            <li
                onClick={(event) => {
                    event.stopPropagation()
                }}
            >
                <div className="icon">
                    <Image src="/svg/terms/mail.svg" alt="wallet" width={18} height={18} unoptimized />
                </div>
                <p>{user?.profile?.user?.email}</p>
            </li>
            <Link href={`/order`}>
                <div className="icon">
                    <Image src="/svg/order/coins-stacked-01.svg" alt="wallet" width={18} height={18} unoptimized />
                </div>
                <span>История пополнения баланса</span>
            </Link>
            <li
                onClick={(event) => {
                    event.stopPropagation()
                }}
            >
                <div className="icon">
                    <Image src="/svg/terms/wallet.svg" alt="wallet" width={18} height={18} unoptimized />
                </div>
                <p>{Number(user?.profile?.balance?.current_balance)?.toFixed(2)}</p>
            </li>
            {isStaff ? (
                <li onClick={() => push("/analytics")}>
                    <div className="icon">
                        <Image src="/svg/terms/bar-chart.svg" alt="bar-chart" width={18} height={18} unoptimized />
                    </div>
                    <p>{t("Accountant_office")}</p>
                </li>
            ) : null}
            <li
                onClick={() => {
                    push("/invited", undefined, { shallow: true })
                }}
            >
                <div className="icon">
                    <Image src="/svg/terms/attachment.svg" alt="wallet" width={18} height={18} unoptimized />
                </div>
                <p>{t("Invite_a_friend")}</p>
            </li>
            <li onClick={() => setActive(true)}>
                <div className="icon">
                    <Image src="/svg/terms/type.svg" alt="wallet" width={18} height={18} unoptimized />
                </div>
                <p>Сменить язык</p>
            </li>
            <Modal open={active} footer={null} onCancel={() => setActive(false)} centered closable={false}>
                <ul className={styles.modalUl}>
                    {FLAGS_LANGUAGE.map((item) => (
                        <li key={`${item.value}`} onClick={() => handleLanguage(item.value)}>
                            <p>{item.label}</p>
                        </li>
                    ))}
                </ul>
            </Modal>
        </>
    )
}
