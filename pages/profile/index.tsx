import { FC } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import ItemsData from "components/profile/ItemsData";
import Loader from "@loader-spin";

import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUser } from "store/use-user";
import { replaceHttps } from "functions/replace-https";
import loadImage from "functions/load-image";
import { cx } from "functions/cx";

import styles from "./styles.module.scss"

const Profile: FC = () => {
        const { t } = useTranslation()
        const { push } = useRouter()
        const loading = useUser(state => state.loading)
        const user = useUser(state => state.user)
        const isSpeaker = useUser(state => state.is_speaker)
        useDocumentTitle("Profile")

        if (loading) return <Loader />

        return (
                <div className="wrapper-profile show-animate">
                        <div className={cx(styles.header, isSpeaker && styles.speaker)}>
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
                                        <h3>{ user?.profile?.user?.full_name}</h3>
                                </div>
                        </div>
                        <div className="profile-content">
                                <div className="profile-info-other">
                                        <ItemsData />
                                </div>
                                <a onClick={() => push(`/terms`, undefined, { shallow: true })}>{t("Terms of user agreements and other documentation")}</a>
                        </div>
                </div>
        )
}

export default Profile