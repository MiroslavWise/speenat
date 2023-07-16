import { useEffect } from "react";
import Image from "next/image";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import Loader from "@loader-spin";
import Specialization from "components/teachers/profile/Specialization";
import Feedbacks from "components/teachers/profile/Feedbacks";

import { useWeb } from "context/WebSocketContext";
import { speakerId, profileId } from "api/api-user";
import loadImage from "functions/load-image";
import { replaceHttps } from "functions/replace-https";

const ProfileTeacher: NextPage = () => {
        const { query: { id } } = useRouter()
        
        const { data, isLoading, refetch } = useQuery(["speaker", id], () => Promise.all([speakerId(id), profileId(id)]))

        const { wsChannel } = useWeb()
        
        useEffect(() => {
                const eventMessage = (event: MessageEventInit<any>) => {
                        if (event) {
                                const message: any = JSON.parse(event?.data)
                                if (message?.data?.type === "update_speaker_list") {
                                        refetch()
                                }
                        }
                }

                if (wsChannel) {
                        wsChannel?.addEventListener('message', eventMessage)
                }

                return wsChannel?.removeEventListener('message', eventMessage)
        }, [wsChannel])

        if (isLoading) return <Loader />
        
        console.log("data: ", data)

        return (
                <div className="wrapper-profile">
                        <div className="header-profile" />
                        <div className="profile-content">
                                <p className="profile-name">{data?.[1]?.full_name!}</p>
                                <div className="profile-info-other">
                                        <Specialization
                                                data={data?.[0]?.get_all_specialization}
                                                online={data?.[0]?.profile?.status === "online"}
                                                speaker={data?.[0]!}
                                                profile={data?.[1]!}
                                        />
                                        <Feedbacks />
                                </div>
                        </div>
                        <div className="profile-avatar-div">
                                <Image
                                        loader={loadImage}
                                        src={(data &&  data[0]?.profile?.photo_url) ? replaceHttps(data[0]?.profile?.photo_url) : "/images/default.png"}
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
                                <div className={`teacher-status-current ${data?.[0]?.profile?.status === "online" ? "status-online" : data?.[0]?.profile?.status === "busy" ? "status-busy":  "status-offline" }`}/>
                        </div>
                        
                </div>
        )
}

export default ProfileTeacher