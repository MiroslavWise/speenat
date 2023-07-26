import { FC } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import ItemsData from "components/profile/ItemsData";
import Loader from "@loader-spin";

import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUser } from "store/use-user";
import { replaceHttps } from "functions/replace-https";
import loadImage from "functions/load-image";
import { useTranslation } from "react-i18next";


const Profile: FC = () => {
        const { t } = useTranslation()
        const { push } = useRouter()
        const loading = useUser(state => state.loading)
        const user = useUser(state => state.user)
        useDocumentTitle("Profile")

        if(loading) return <Loader />
        
        return (
                <div className="wrapper-profile show-animate">
                        <div className="header-profile"/>
                        <div className="profile-content">
                                <p className="profile-name">{user?.profile?.user?.full_name}</p>
                                <div className="profile-info-other">
                                        <ItemsData />
                                </div>
                                <a onClick={() => push(`/terms`, undefined, { shallow: true })}>{t("Terms of user agreements and other documentation")}</a>
                        </div>
                        <div className="profile-avatar-div">
                                <Image
                                        src={user?.profile?.photo ? replaceHttps(user?.profile?.photo) : "/images/flower.jpg"}
                                        alt=""
                                        loader={loadImage}
                                        height={115}
                                        width={115}
                                        style={{
                                                objectFit: "cover",
                                                borderRadius: '50%',
                                                padding: 0,
                                                margin: 0,
                                        }}
                                />
                        </div>
                </div>
        )
}

export default Profile