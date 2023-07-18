import { FC, useContext, useEffect, useState } from "react";

import { Modal, Button, Row, Divider } from "antd";

import { ICallData } from "types/call";

import PhoneOff from "components/icons/phone-off";
import PhoneIncoming from "components/icons/phone-incoming";

import { useWeb } from "context/WebSocketContext";
import { CreateJanusContext } from "context/ContextJanus";

import { platform } from "functions/platform";

interface IProps {
        propsCall: ICallData | null
        setPropsCall: (args: ICallData | null) => void
}

export const ModalCall: FC<IProps> = ({ propsCall, setPropsCall }) => {
        const [visible, setVisible] = useState(false)

        const { wsChannel } = useWeb()
        const context = useContext(CreateJanusContext)
        const registerUsername = context?.registerUsername!

        useEffect(() => {
                const listenerCall = (event: any) => {
                        const notification: ICallData = JSON.parse(event.data).data

                        if (notification?.type === "incall") {
                                // play()
                                setPropsCall({ ...notification })
                                setVisible(true)
                        }
                        if (["call_cancel_from_user", "call_accept_cancel"]?.includes(notification?.type)) {
                                setPropsCall(null)
                                setVisible(false)
                                stop()
                        }
                        if (notification?.type === "call_accept_ok") {
                                // stop()
                        }
                }

                wsChannel?.addEventListener('message', listenerCall)

                return () => wsChannel?.removeEventListener("message", listenerCall)
        }, [wsChannel])

        const speakerAnswer = (answer: boolean) => {
                if (answer) {
                        registerUsername()
                        wsChannel?.send(
                                JSON.stringify({
                                        data: {
                                                type: "call_accept_ok",
                                                speaker_id: propsCall?.speaker_id,
                                                conf_id: propsCall?.call_info?.conf_id,
                                                device_type: platform,
                                                student_id: propsCall?.user_info?.profile_id,
                                                status: true
                                        }
                                })
                        )
                        setVisible(false)
                        // stop()
                } else {
                        wsChannel?.send(
                                JSON.stringify({
                                        data: {
                                                type: "call_accept_cancel",
                                                speaker_id: propsCall?.speaker_id,
                                                conf_id: propsCall?.call_info?.conf_id,
                                                student_id: propsCall?.user_info?.profile_id,
                                                status: false,
                                        }
                                })
                        )
                        setVisible(false)
                        // stop()
                }
        }

        return (
                <Modal
                        open={visible}
                        closable={false}
                        centered
                        footer={[
                                <Row className="w-100" key={'row-modal-call'} justify="space-between">
                                        <Button
                                                type="primary"
                                                style={{
                                                        backgroundColor: '#32CD32'
                                                }}
                                                onClick={() => { speakerAnswer(true) }}
                                        >
                                                <div
                                                        style={{
                                                                display: "flex",
                                                                flexDirection: 'row',
                                                                gap: 10,
                                                        }}
                                                >
                                                        <PhoneIncoming fill="#fff" />
                                                        <p className="">Принять</p>
                                                </div>
                                        </Button>
                                        <Button
                                                type="dashed"
                                                style={{
                                                        borderColor: 'red',
                                                        color: 'red'
                                                }}
                                                onClick={() => { speakerAnswer(false) }}
                                        >
                                                <div
                                                        style={{
                                                                display: "flex",
                                                                flexDirection: 'row',
                                                                gap: 10,
                                                        }}
                                                >
                                                        <PhoneOff />
                                                        <p className="">Отклонить</p>
                                                </div>
                                        </Button>
                                </Row>
                        ]}
                >
                        <Row justify="center" gutter={10}>
                                <h5>Входящий вызов от: {propsCall?.user_info?.full_name}</h5>
                        </Row>
                        <Row justify="start">
                                <h6>Специальность: {propsCall?.call_info?.specialization} (Сеанс: {propsCall?.call_info?.sessions_time.replace('min', ' мин')})</h6>
                        </Row>
                        <Divider />
                        <Row justify="center" className="w-100">
                                <Row justify="center" style={{ maxWidth: 350 }}>
                                        <p style={{ color: 'black', textAlign: 'center' }}>Качество разговора со студентом зависит от вашего интернет-соединения</p>
                                </Row>
                        </Row>
                        <br />
                </Modal>
        )
}