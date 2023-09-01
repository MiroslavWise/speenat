import { useEffect } from "react"
import Image from "next/image"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useQuery } from "react-query"

import Loader from "@loader-spin"
import Specialization from "components/teachers/profile/Specialization"
import Feedbacks from "components/teachers/profile/Feedbacks"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useWeb } from "context/WebSocketContext"
import { speakerId } from "api/api-user"
import loadImage from "functions/load-image"
import { replaceHttps } from "functions/replace-https"

import styles from "./style.module.scss"
import { cx } from "functions/cx"

const ProfileTeacher: NextPage = () => {
    const {
        query: { id },
    } = useRouter()
    useDocumentTitle("Teacher")

    const { data, isLoading, refetch } = useQuery(["speaker", id], () =>
        speakerId(id),
    )

    const { wsChannel } = useWeb()

    useEffect(() => {
        const eventUpdate = (event: MessageEventInit<any>) => {
            const lastMessage: any = JSON.parse(event?.data)
            if (lastMessage?.data?.type === "update_speaker_list") {
                refetch()
            }
        }
        if (wsChannel) {
            wsChannel?.addEventListener("message", eventUpdate)
        }

        return () => wsChannel?.removeEventListener("message", eventUpdate)
    }, [wsChannel])

    if (isLoading) return <Loader />

    return (
        <div className="wrapper-profile">
            <div className={cx(styles.header)}>
                <div className={styles.avatar}>
                    <Image
                        loader={loadImage}
                        src={
                            data && data?.profile?.photo_url
                                ? replaceHttps(data?.profile?.photo_url)
                                : "/images/default.png"
                        }
                        alt="ad"
                        height={115}
                        width={115}
                    />
                </div>
                <div className={styles.nameInfo}>
                    <h3>{data?.profile?.full_name}</h3>
                </div>
            </div>
            <div className="profile-content">
                <div className="profile-info-other">
                    <Specialization
                        data={data?.get_all_specialization}
                        online={data?.profile?.status === "online"}
                        speaker={data!}
                    />
                    <Feedbacks />
                </div>
            </div>
        </div>
    )
}

export default ProfileTeacher