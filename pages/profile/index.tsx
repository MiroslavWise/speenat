import Image from "next/image";
import { FC } from "react";

import { useUser } from "store/use-user";

import ItemsData from "components/profile/ItemsData";
import Loader from "@loader-spin";
import { useRouter } from "next/router";


const Profile: FC = () => {
        const { push } = useRouter()
        const loading = useUser(state => state.loading)
        const user = useUser(state => state.user)
        const user_photo = useUser(state => state.user?.profile.photo)

        if(loading) return <Loader />
        
        return (
                <div className="wrapper-profile">
                        <div className="header-profile"/>
                        <div className="profile-content">
                                <p className="profile-name">{user?.profile?.user?.full_name}</p>
                                <div className="profile-info-other">
                                        <ItemsData />
                                </div>
                                <a onClick={() => push(`/terms`, undefined, { shallow: true })}>Условия пользовательских соглашений и другая документация</a>
                        </div>

                        <div className="profile-avatar-div">
                                <Image
                                        src={user_photo ? user_photo : "/images/flower.jpg"}
                                        alt=""
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