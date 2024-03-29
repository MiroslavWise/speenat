import { FC, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Modal, Button, Row, Divider } from "antd/lib"

import PhoneOff from "components/icons/phone-off"
import PhoneIncoming from "components/icons/phone-incoming"

import usePlaySound from "hooks/usePlaySound"
import { useWeb } from "context/WebSocketContext"
import { CreateJanusContext } from "context/ContextJanusVideoRoom"
import { usePropsCallingJanus } from "store/use-call-janus"

import { platform } from "functions/platform"

export const ModalCall: FC = () => {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(false)

    const { incomingDoctorCall } = usePlaySound()

    const { wsChannel } = useWeb()
    const context = useContext(CreateJanusContext)
    const { joinAndVisible, createRoom } = context ?? {}
    const call_info = usePropsCallingJanus(({ call_info }) => call_info)
    const speaker_info = usePropsCallingJanus(({ speaker_info }) => speaker_info)
    const user_info = usePropsCallingJanus(({ user_info }) => user_info)
    const setCallInfo = usePropsCallingJanus(({ setCallInfo }) => setCallInfo)
    const setSpeakerInfo = usePropsCallingJanus(({ setSpeakerInfo }) => setSpeakerInfo)
    const setUserInfo = usePropsCallingJanus(({ setUserInfo }) => setUserInfo)
    const deleteAll = usePropsCallingJanus(({ deleteAll }) => deleteAll)
    const setUuidRoom = usePropsCallingJanus(({ setUuidRoom }) => setUuidRoom)

    useEffect(() => {
        const listenerCall = (event: any) => {
            const notification: any = JSON.parse(event.data).data

            console.log("notification: ", notification)

            if (notification?.type === "incall") {
                console.log("notification: ", notification)
                requestAnimationFrame(() => {
                    incomingDoctorCall()
                })
                setCallInfo(notification.call_info)
                setSpeakerInfo(notification.speaker_info)
                setUserInfo(notification.user_info)
                setUuidRoom(notification.call_info.uuid)
                setVisible(true)
            }
            if (["call_cancel_from_user", "call_accept_cancel"]?.includes(notification?.type)) {
                deleteAll()
                setVisible(false)
                stop()
            }
            if (notification?.type === "call_accept_ok") {
            }
        }
        wsChannel?.addEventListener("message", listenerCall)
        return () => wsChannel?.removeEventListener("message", listenerCall)
    }, [wsChannel])

    const speakerAnswer = (answer: boolean) => {
        if (answer) {
            if (joinAndVisible && createRoom) {
                createRoom(call_info?.conf_id!).finally(() => {
                    joinAndVisible(Number(call_info?.conf_id!))
                })
            }
            wsChannel?.send(
                JSON.stringify({
                    data: {
                        type: "call_accept_ok",
                        speaker_id: speaker_info?.speaker_id,
                        conf_id: call_info?.conf_id,
                        device_type: platform,
                        student_id: user_info?.profile_id,
                        status: true,
                    },
                }),
            )
            setVisible(false)
            stop()
        } else {
            wsChannel?.send(
                JSON.stringify({
                    data: {
                        type: "call_accept_cancel",
                        speaker_id: speaker_info?.speaker_id,
                        conf_id: call_info?.conf_id,
                        student_id: user_info?.profile_id,
                        status: false,
                    },
                }),
            )
            setVisible(false)
            stop()
        }
    }

    return (
        <Modal
            open={visible}
            closable={false}
            centered
            footer={[
                <Row className="w-100" key={"row-modal-call"} justify="space-between">
                    <Button
                        type="primary"
                        style={{
                            backgroundColor: "#32CD32",
                        }}
                        onClick={() => {
                            speakerAnswer(true)
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                            }}
                        >
                            <PhoneIncoming fill="#fff" />
                            <p className="">{t("To accept")}</p>
                        </div>
                    </Button>
                    <Button
                        type="dashed"
                        style={{
                            borderColor: "#f10 !important",
                            outline: "#f10 !important",
                            color: "#f10",
                        }}
                        onClick={() => {
                            speakerAnswer(false)
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                gap: 10,
                            }}
                        >
                            <PhoneOff />
                            <p className="">{t("Reject")}</p>
                        </div>
                    </Button>
                </Row>,
            ]}
        >
            <Row justify="center" gutter={10}>
                <h5>
                    {t("Incoming call from")}: {user_info?.full_name}
                </h5>
            </Row>
            <Row justify="start">
                <h6>
                    {t("Specialization")}: {call_info?.specialization} (Сеанс:{" "}
                    {call_info?.sessions_time.replace("min", " мин")})
                </h6>
            </Row>
            <Divider />
            <Row justify="center" className="w-100">
                <Row justify="center" style={{ maxWidth: 350 }}>
                    <p style={{ color: "black", textAlign: "center" }}>
                        {t("The quality of the conversation with the student depends on your internet connection")}
                    </p>
                </Row>
            </Row>
            <br />
        </Modal>
    )
}
