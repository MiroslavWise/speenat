import { useTranslation } from "react-i18next"
import { useContext, useState, useEffect } from "react"
import { shallow } from "zustand/shallow"
import Link from "next/link"
import Image from "next/image"

import { useUser } from "store/use-user"
import { apiSpeakerReview, apiToSpeakerFeedback } from "api/api-review"
import { updateStatus } from "api/api-status"
import { useRouter } from "next/router"
import { Button, Input, Rate, Row, Space } from "antd"
import { usePropsCallingJanus } from "store/use-call-janus"

import styles from "./style.module.scss"
import { replaceHttps } from "functions/replace-https"

const Feedback = () => {
    const { t } = useTranslation()
    const { push } = useRouter()
    const [text, setText] = useState("")
    const [rate, setRate] = useState(0)
    const { deleteAll, call_info, speaker_info, user_info } = usePropsCallingJanus(
        (state) => ({
            call_info: state.call_info,
            speaker_info: state.speaker_info,
            user_info: state.user_info,
            deleteAll: state.deleteAll,
        }),
        shallow,
    )

    const { user, isSpeaker } = useUser(
        (state) => ({
            isSpeaker: state.is_speaker,
            user: state.user,
        }),
        shallow,
    )

    useEffect(() => {
        if (!!deleteAll && !call_info) {
            if (isSpeaker) {
                push("/archive")
            } else {
                push("/teachers")
            }
        }
    }, [call_info, deleteAll])

    const btnCancel = () => {
        if (isSpeaker) {
            updateStatus("online").finally(() => {
                push("/archive")
                //@ts-ignore
                deleteAll()
            })
        } else {
            push("/teachers")
        }
    }

    const sendReview = () => {
        if (isSpeaker) {
            const data = {
                speaker: user?.profile?.profile_id,
                student: user_info?.profile_id,
                conference: call_info?.conf_id,
                text: text,
            }
            apiSpeakerReview(data).finally(() => {
                updateStatus("online").finally(() => {
                    push("/archive")
                    //@ts-ignore
                    deleteAll()
                })
            })
        } else {
            const data = {
                speaker: speaker_info?.profile_id,
                author: user?.profile?.profile_id,
                conference: call_info?.conf_id,
                rating: rate,
                text: text,
            }
            apiToSpeakerFeedback(data).finally(() => {
                push("/teachers")
                if (deleteAll) deleteAll()
            })
        }
    }

    useEffect(() => {
        return () => {
            setTimeout(() => {
                if (deleteAll) deleteAll()
                location.reload()
            }, 250)
        }
    }, [])

    const urlAvatar =
        speaker_info?.avatar_url?.includes("default") || !speaker_info?.avatar_url
            ? "/images/default.png"
            : replaceHttps(speaker_info?.avatar_url!)
    const urlStudent =
        user_info?.avatar_url?.includes("default") || !user_info?.avatar_url
            ? "/images/default.png"
            : replaceHttps(user_info?.avatar_url!)

    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <header>
                    <h2>{isSpeaker ? t("Recommendations to the student") : t("Rate the teacher")}</h2>
                </header>
                <section>
                    <Image
                        src={isSpeaker ? urlStudent : urlAvatar}
                        alt="avatar"
                        width={400}
                        height={400}
                        className={styles.avatar}
                        unoptimized
                    />
                    <h4>{isSpeaker ? user_info?.full_name : speaker_info?.full_name}</h4>
                    <Input.TextArea
                        className={styles.textArea}
                        rows={4}
                        minLength={10}
                        placeholder={
                            isSpeaker
                                ? `${t("Write a recommendation to the student")} ${user_info?.full_name}`
                                : t("feedback")!
                        }
                        value={text}
                        onChange={(value) => {
                            setText(value?.target?.value)
                        }}
                    />
                    {!isSpeaker ? (
                        <Rate onChange={setRate} value={rate} style={{ color: "var(--premium-color)" }} />
                    ) : null}
                    <Button className={styles.button} onClick={sendReview} disabled={text.length < 5}>
                        <p>{t("Send")}</p>
                    </Button>
                </section>
                <footer>
                    <Link href={isSpeaker ? "/archive" : "/teachers"}>{t("Go to Home")}</Link>
                </footer>
            </div>
        </div>
    )
}

export default Feedback
