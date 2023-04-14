import Image from "next/image";
import { FC } from "react";

import { useUser } from "store/use-user";



const Profile: FC = () => {
        
        const loading = useUser(state => state.loading)
        const user = useUser(state => state.user)
        
        return (
                <div className="wrapper-profile">
                        <div className="header-profile">
                        </div>
                        <div className="profile-content">
                                <p className="profile-name">Victoria Robertson</p>
                                <div className="profile-info-other">

                                </div>
                        </div>

                        <div className="profile-avatar-div">
                                <Image
                                        src="/images/flower.jpg"
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