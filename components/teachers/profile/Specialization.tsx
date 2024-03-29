import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Button, Divider, Modal, Row, Space } from "antd/lib"
import { FC, useContext, Dispatch, useEffect } from "react"

import type { ISpeakerData, ISpec } from "types/store/user"

import Time from "@icons-time"
import Wallet from "@icons-wallet"
import PhoneOff from "components/icons/phone-off"

import { platform } from "functions/platform"
import { useWeb } from "context/WebSocketContext"
import { work_experience } from "functions/work-exp"
import { CreateJanusContext } from "context/ContextJanusVideoRoom"
import { useQuery } from "react-query"
import { profileMy } from "api/api-user"
import { useAuth } from "store/use-auth"
import { useRouter } from "next/router"

const Specialization: FC<{
    data: ISpec[] | undefined
    online: boolean
    speaker: ISpeakerData
}> = ({ data, online, speaker }) => {
    const { t } = useTranslation()
    const { push } = useRouter()
    const token = useAuth(({ token }) => token)
    const contextJanus = useContext(CreateJanusContext)
    const { visible: janusVisible } = contextJanus ?? {}
    const { wsChannel } = useWeb()

    const { data: dataMe } = useQuery({
        queryFn: () => profileMy(),
        queryKey: ["profile-me", token!],
        enabled: !!token,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const startEndTimer = (value: boolean) => {
        const onTimer = setTimeout(() => {
            if (!janusVisible) {
                handleCancelCall()
            }
        }, 60_000)

        if (value === false) {
            clearTimeout(onTimer)
        }
    }

    const handleCancelCall = () => {
        if (!janusVisible) {
            wsChannel?.send(
                JSON.stringify({
                    data: {
                        type: "call_cancel_user",
                        speaker_profile_id: speaker?.profile?.profile_id,
                        student_id: dataMe?.profile?.profile_id,
                        status: false,
                    },
                }),
            )
            Modal.destroyAll()
        }
    }

    useEffect(() => {
        if (wsChannel) {
            wsChannel.addEventListener("message", eventMessage)
        }
        return () => wsChannel?.removeEventListener("message", eventMessage)
    }, [wsChannel])

    const handleBell = (time_id: any, specialization_id: any, spec: any, time: any) => {
        calling(spec, time, handleCancelCall, speaker, startEndTimer, t)
        startEndTimer(true)
        const data = {
            type: "user_call",
            time_id: time_id,
            spec_id: specialization_id,
            device_type: platform,
            speaker_profile_id: speaker?.profile?.profile_id,
            profile_id: dataMe?.profile?.profile_id,
            note_id: false,
        }
        wsChannel?.send(JSON.stringify({ data: data }))
    }

    useEffect(() => {
        const cancel = (event: any) => {
            const message_ = JSON.parse(event?.data)
            if (message_?.data?.type === "call_accept_cancel") {
                Modal.destroyAll()
                requestAnimationFrame(() => {
                    onCancelSpeakerCall()
                })
            }
        }

        wsChannel?.addEventListener("message", cancel)

        return () => wsChannel?.removeEventListener("message", cancel)
    }, [wsChannel])

    return (
        <div className="list-spec">
            {data &&
                data?.length > 0 &&
                data?.map((item) => (
                    <div key={`${item?.profile?.id}_${item?.specialization_id}`} className="container-spec">
                        <div className="title">
                            <div className="image-headphone">
                                <Image src="/gif/headphone.gif" alt="gif" height={30} width={30} className="img" />
                            </div>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 7,
                                }}
                            >
                                <p className="name">{item?.specialization?.name}</p>
                                <p className="sub-name"> {item?.specialization?.description}</p>
                            </div>
                        </div>
                        <div className="content">
                            <p className="name">{t("Work experience and education")}:</p>
                            {item?.topic_conversation?.length > 0 ? (
                                <p className="sub-name">
                                    <b>Темы общения: </b>
                                    {item?.topic_conversation?.map((it) => it.name)?.join(", ")}
                                </p>
                            ) : null}
                            {item?.university ? (
                                <p className="sub-name">
                                    <b>{t("UNIVERSITY")}: </b>
                                    {item?.university}
                                </p>
                            ) : null}
                            <p className="sub-name">
                                <b>{t("Work experience")}: </b>
                                {work_experience(item?.work_experience, t)}
                            </p>
                            {item?.region_living ? (
                                <p className="sub-name">
                                    <b>{t("Region of residence")}: </b>
                                    {item?.region_living}
                                </p>
                            ) : null}
                            {item?.additional_info ? (
                                <p className="sub-name">
                                    <b>{t("Additional information")}: </b>
                                    {item?.additional_info}
                                </p>
                            ) : null}
                        </div>
                        <div className="consultation-time-list">
                            {item?.consultation_time?.map((time) => (
                                <div className="bell-container" key={`time_${time?.id}`}>
                                    {online &&
                                    Number(dataMe?.profile?.balance?.current_balance!) >= Number(time?.price) ? (
                                        <Button
                                            type="text"
                                            className="but-bell"
                                            onClick={() => handleBell(time?.id, item?.specialization_id, item, time)}
                                        >
                                            <p>{t("To call")}</p>
                                        </Button>
                                    ) : Number(dataMe?.profile?.balance?.current_balance!) <= Number(time?.price) ? (
                                        <Button
                                            type="text"
                                            className="but-bell"
                                            data-amount
                                            onClick={() => {
                                                push(
                                                    `/pay-data?amount-min=${
                                                        +Number(time?.price)?.toFixed(0) -
                                                        +Number(dataMe?.profile?.balance?.current_balance!)?.toFixed(0)
                                                    }`,
                                                )
                                            }}
                                        >
                                            <p>Пополнить</p>
                                        </Button>
                                    ) : null}
                                    <div className="times">
                                        <Time size={25} fill="var(--cyan)" />
                                        <p>{time?.sessions_time?.replace("min", " мин")}</p>
                                    </div>
                                    <div className="times">
                                        <Wallet size={25} fill="var(--cyan)" />
                                        <p>{time?.price}₸</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
        </div>
    )
}

export default Specialization

const calling = (
    info: any,
    time: any,
    handleCancelCall: () => void,
    speaker: any,
    startEndTimer: Dispatch<boolean>,
    t: (value: string) => string,
) =>
    Modal.info({
        closable: false,
        width: "max(500px)",
        icon: null,
        footer: null,
        onCancel() {
            startEndTimer(false)
            handleCancelCall()
        },
        content: (
            <div className="w-100">
                <Row justify="center" className="w-100">
                    <h4>
                        <span> {t("Waiting for a response from")}&nbsp;</span>
                        <span>{speaker?.profile?.full_name}</span>
                    </h4>
                </Row>
                <Space direction="vertical">
                    <p>
                        <b>{t("Specialization")}</b>: {info?.specialization?.name}
                    </p>
                    <p>
                        <b>{t("Session")}</b>: {time?.sessions_time?.replace("min", " минут")}
                    </p>
                </Space>
                <Divider />
                <Row justify="center" className="w-100">
                    <Row justify="center" style={{ maxWidth: 350 }}>
                        <h3 style={{ color: "red", textAlign: "center" }}>{t("Connection is in progress")}</h3>
                    </Row>
                    <Row justify="center" style={{ maxWidth: 350 }}>
                        <p style={{ color: "red", textAlign: "center" }}>
                            {t("Wait a bit - do not close the app and do not lock the phone")}
                        </p>
                    </Row>
                    <Row justify="center" style={{ maxWidth: 350 }}>
                        <p style={{ textAlign: "center" }}>
                            {t("The speaker's response time depends on the quality of your internet connection")}
                        </p>
                    </Row>
                </Row>
                <br />
                <Row justify="center">
                    <Button type="primary" className="but-bell" onClick={handleCancelCall}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <PhoneOff fill="var(--premium-color)" />
                            <p>{t("Reject")}</p>
                        </div>
                    </Button>
                </Row>
            </div>
        ),
    })

const onCancelSpeakerCall = () =>
    Modal.info({
        closable: false,
        width: "max(350px)",
        icon: null,
        centered: true,
        footer: null,
        content: (
            <div className="w-100">
                <Row
                    justify="center"
                    className="w-100"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <p style={{ color: "red", textAlign: "center" }}>Спикер отклонил ваш вызов</p>
                </Row>
                <br />
                <Row justify="center">
                    <Button type="primary" onClick={() => Modal.destroyAll()}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    margin: "0 0 0 0.5rem",
                                    color: "white",
                                }}
                            >
                                Ок
                            </span>
                        </div>
                    </Button>
                </Row>
            </div>
        ),
    })

const timeDetected = () =>
    Modal.info({
        closable: false,
        width: "max(350px)",
        icon: null,
        footer: null,
        centered: true,
        content: (
            <div className="w-100">
                <Row
                    justify="center"
                    className="w-100"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                    }}
                >
                    <p style={{ color: "red", textAlign: "center" }}>
                        Время вызова истекло, и спикер не принял ваш вызов
                    </p>
                </Row>
                <br />
                <Row justify="center">
                    <Button type="primary" onClick={() => Modal.destroyAll()}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    margin: "0 0 0 0.5rem",
                                    color: "white",
                                }}
                            >
                                Ок
                            </span>
                        </div>
                    </Button>
                </Row>
            </div>
        ),
    })

function eventMessage(event: any) {
    const data = JSON.parse(event.data).data
    if (data?.type === "call_accept_ok") {
        Modal.destroyAll()
    }
}
