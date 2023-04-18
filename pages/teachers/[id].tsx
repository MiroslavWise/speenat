import Image from "next/image";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import Loader from "@loader-spin";

import { speakerId, profileId } from "api/api-user";
import loadImage from "functions/load-image";


const ProfileTeacher: NextPage = () => {
        const { query: { id } } = useRouter()
        
        const { data, isLoading } = useQuery(["speaker", id], () => Promise.all([speakerId(id), profileId(id)]))

        if(isLoading) return <Loader />

        return (
                <div className="wrapper-profile">
                        <div className="header-profile" />
                        <div className="profile-content">
                                <p className="profile-name">{ data && data[1]?.full_name}</p>
                        </div>
                        
                        <div className="profile-avatar-div">
                                <Image
                                        loader={loadImage}
                                        src={data &&  data[0]?.profile?.photo_url || ""}
                                        alt="ad"
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

export default ProfileTeacher