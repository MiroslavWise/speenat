import Link from "next/link"
import { type FC } from "react"
import Image from "next/image"
import { useTranslation } from "react-i18next"

import Loader from "@loader-spin"
import { TERMS } from "components/terms/list-terms"
import { ItemsData } from "components/profile/ItemsData"

import { cx } from "functions/cx"
import { useUser } from "store/use-user"
import loadImage from "functions/load-image"
import { replaceHttps } from "functions/replace-https"
import { useDocumentTitle } from "hooks/useDocumentTitle"

import styles from "./styles.module.scss"

const Profile: FC = () => {
    const { t } = useTranslation()
    const loading = useUser((state) => state.loading)
    const user = useUser((state) => state.user)
    useDocumentTitle("Profile")

    if (loading) return <Loader />

    return (
        <>
            <div className="wrapper-profile show-animate">
                <div className={cx(styles.header)}>
                    <div className={styles.avatar}>
                        <Image
                            src={user?.profile?.photo ? replaceHttps(user?.profile?.photo) : "/images/flower.jpg"}
                            alt=""
                            loader={loadImage}
                            height={115}
                            width={115}
                        />
                    </div>
                    <div className={styles.nameInfo}>
                        <h3>{user?.profile?.user?.full_name}</h3>
                        <Link className={styles.buttonEdit} href={{ pathname: "/profile/change" }}>
                            <Image src="/svg/user-edit.svg" alt="user-edit" height={16} width={16} />
                            <p>{t("Edit")}</p>
                        </Link>
                    </div>
                </div>
                <div className="profile-content">
                    <ul className="profile-info-other">
                        <ItemsData />
                        <Link data-delete href={{ pathname: `/delete-account` }}>
                            <span>{t("Delete_Account")}</span>
                        </Link>
                    </ul>
                </div>
                <h2>{t("Terms_and_Agreements")}</h2>
                <div className="profile-content">
                    <ul className="profile-info-other">
                        {TERMS.map((item) => (
                            <Link key={item.path} href={item.path ? item.path : {}}>
                                <div className="icon">
                                    <Image src={item.icon} alt={item.icon} width={18} height={18} />
                                </div>
                                <p>{t(item.label)}</p>
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Profile
