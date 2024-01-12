import { useTranslation } from "react-i18next"
import Image from "next/image"
import { useRouter } from "next/router"
import { useQuery } from "react-query"
import { shallow } from "zustand/shallow"

import Loader from "@loader-spin"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { conference } from "api/api-user"
import { useUser } from "store/use-user"
import loadImage from "functions/load-image"
import { srcImage } from "functions/src-image"
import { replaceHttps } from "functions/replace-https"
import dayjs from "dayjs"
import { statusCallConf } from "functions/status-conf"
import { PlyrPlayer } from "components/PlyrPlayer"

import styles from "./style.module.scss"

export default function ArchiveCurrent() {
    const {
        query: { id },
    } = useRouter()
    const { t } = useTranslation()
    useDocumentTitle("Архив")

    const { data, isLoading } = useQuery(["archive", id], () => conference(id))

    const { isSpeaker, loading, user } = useUser(
        (state) => ({
            isSpeaker: state.is_speaker,
            user: state.user,
            loading: state.loading,
        }),
        shallow,
    )

    if (isLoading || loading) return <Loader />

    return (
        <div className="content-archive">
            <div className="list-archive">
                <section className={styles.container}>
                    <Image
                        loader={loadImage}
                        src={srcImage(
                            isSpeaker && data?.student_profile?.photo_url
                                ? replaceHttps(data?.student_profile?.photo_url)
                                : data?.speaker?.profile?.photo_url
                                  ? replaceHttps(data?.speaker?.profile?.photo_url)
                                  : "default",
                        )}
                        alt="photo"
                        height={200}
                        width={200}
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                            borderRadius: 10,
                            aspectRatio: "1/1",
                        }}
                        className="avatar"
                    />
                    <ul>
                        <li>
                            <p>
                                {isSpeaker ? `${t("Student")}:` : `${t("Speaker")}: `}{" "}
                                <span>
                                    {isSpeaker ? data?.student_profile?.full_name : data?.speaker?.profile?.full_name}
                                </span>
                            </p>
                        </li>
                        <li>
                            <p>
                                {t("Session date")}: <span>{dayjs(data?.created_at).format("HH:mm DD.MM.YYYY")}</span>
                            </p>
                        </li>
                        <li>
                            <p>
                                {t("Status")}:{" "}
                                <span style={{ color: statusCallConf(data?.status)?.color }}>
                                    {t(statusCallConf(data?.status).title)}
                                </span>
                            </p>
                        </li>
                    </ul>
                </section>
                {data?.record_url !== "not_found" ? (
                    <PlyrPlayer
                        source={{
                            type: "video",
                            sources: [
                                {
                                    type: "video/mp4",
                                    src: data?.record_url,
                                },
                            ],
                        }}
                    />
                ) : null}
            </div>
        </div>
    )
}
