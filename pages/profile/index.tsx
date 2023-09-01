import { FC, useState } from "react"
import { useRouter } from "next/router"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Modal } from 'antd'

import { ItemsData } from "components/profile/ItemsData"
import Loader from "@loader-spin"
import { TERMS } from "components/terms/list-terms"


import { useUser } from "store/use-user"
import { useDocumentTitle } from "hooks/useDocumentTitle"
import { replaceHttps } from "functions/replace-https"
import loadImage from "functions/load-image"
import { cx } from "functions/cx"
import { useAntdLang } from "context/LanguageContext"
import changeLanguage from "helpers/changeLanguage"
import { FLAGS_LANGUAGE } from "components/auth/components/constants"

import styles from "./styles.module.scss";

const Profile: FC = () => {
    const { t } = useTranslation()
    const { push } = useRouter()
    const loading = useUser((state) => state.loading)
    const user = useUser((state) => state.user)
    useDocumentTitle("Profile")

    function handleChange() { push("/profile/change", undefined, { shallow: true }) }

    if (loading) return <Loader />

    return (
        <>
            <div className="wrapper-profile show-animate">
                <div className={cx(styles.header)}>
                    <div className={styles.avatar}>
                        <Image
                            src={
                                user?.profile?.photo
                                    ? replaceHttps(user?.profile?.photo)
                                    : "/images/flower.jpg"
                            }
                            alt=""
                            loader={loadImage}
                            height={115}
                            width={115}
                        />
                    </div>
                    <div className={styles.nameInfo}>
                        <h3>{user?.profile?.user?.full_name}</h3>
                        <div className={styles.buttonEdit} onClick={handleChange}>
                            <Image
                                src="/svg/user-edit.svg"
                                alt="user-edit"
                                height={16}
                                width={16}
                            />
                            <p>{t("Edit")}</p>
                        </div>
                    </div>
                </div>
                <div className="profile-content">
                    <div className="profile-info-other">
                        <ItemsData />
                    </div>
                </div>
                <h2>{t("Условия и соглашения")}</h2>
                <div className="profile-content">
                    <div className="profile-info-other">
                        {TERMS.map((item) => (
                            <li
                                key={item.path}
                                onClick={() => { push(item.path, undefined, { shallow: true }); }}
                            >
                                <div className="icon">
                                    <Image
                                        src={item.icon}
                                        alt={item.icon}
                                        width={18}
                                        height={18}
                                    />
                                </div>
                                <p>{t(item.label)}</p>
                            </li>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile
