import Image from "next/image"
import { FC, useContext, Dispatch, useState, useEffect } from "react"

import type { ISpeakerData, ISpec, IUserCurrent } from "types/store/user"

import { work_experience } from "functions/work-exp"
import { Button, Divider, Modal, Row, Space } from "antd"
import Time from "@icons-time"
import Wallet from "@icons-wallet"
import { platform } from "functions/platform"
import { CreateJanusContext } from "context/ContextJanus"
import { useUser } from "store/use-user"
import { useWeb } from "context/WebSocketContext"
import PhoneOff from "components/icons/phone-off"

const Specialization: FC<{ data: ISpec[] | undefined, online: boolean, speaker: ISpeakerData, profile: IUserCurrent }> = ({ data, online, speaker, profile }) => {
        
        const user = useUser(state => state.user)
        const contextJanus = useContext(CreateJanusContext)
        const registerUsername = contextJanus?.registerUsername
        const [loading, setLoading] = useState(false)
        const [id, setId] = useState<number | null>(null)
        const [uuidRecord, setUuidRecord] = useState<string>('')
        const [visible, setVisible] = useState<boolean>(false)

        const [paramSpec, setParamSpec] = useState<{spec_id: number | null, time_id: number | null}>({spec_id: null, time_id: null})
        const { wsChannel } = useWeb()
        const janusVisible = contextJanus?.visible

        const startEndTimer = (value: boolean) => {
                const onTimer = setTimeout(() => {
                        if (!janusVisible) {
                                handleCancelCall()
                                timeDetected()
                        } 
                }, 60_000)

                if (value === false) {
                        clearTimeout(onTimer)
                }
        }

        const handleCancelCall = () => {
                wsChannel?.send(JSON.stringify({
                        data: {
                                type: 'call_cancel_user',
                                speaker_profile_id: speaker?.profile?.profile_id,
                                patient_id: user?.profile?.profile_id,
                                status: false
                        }
                }))
                Modal.destroyAll()
        }



        const handleBell = (
                time_id: any,
                specialization_id: any,
                spec: any,
                time: any,
        ) => {
                calling(spec, time, handleCancelCall, speaker, startEndTimer)
                startEndTimer(true)
                if (registerUsername) {
                        registerUsername()
                }
                const data = {
                        type: 'user_call',
                        time_id: time_id,
                        spec_id: specialization_id,
                        device_type: platform,
                        speaker_profile_id: speaker?.profile?.profile_id,
                        profile_id: user?.profile?.profile_id,
                        note_id: false
                }
        }

        useEffect(() => {
                const cancel = (event: any) => {
                        const message_ = JSON.parse(event?.data)
                        if (message_?.data?.type === "call_accept_cancel") {
                                Modal.destroyAll()
                                requestAnimationFrame(() => {
                                        onCancelDoctorCall()
                                })
                        }
                }

                wsChannel?.addEventListener('message', cancel)

                return () => wsChannel?.removeEventListener('message', cancel)
        }, [wsChannel])


        return (
                <div className="list-spec">
                        {
                                data && data?.length > 0
                                &&
                                data?.map(item => (
                                        <div
                                                key={`${item?.profile?.id}_${item?.specialization_id}`}
                                                className="container-spec"
                                        >
                                                <div className="title">
                                                        <div className="image-headphone">
                                                                <Image
                                                                        src="/gif/headphone.gif"
                                                                        alt="gif"
                                                                        height={30}
                                                                        width={30}
                                                                        className="img"
                                                                />
                                                        </div>
                                                        <div style={{ display: "flex", flexDirection: 'column', gap: 7, }}>
                                                                <p className="name">{item?.specialization?.name}</p>
                                                                <p className="sub-name"> {item?.specialization?.description}</p>
                                                        </div>
                                                </div>
                                                <div className="content">
                                                        <p className="name">Опыт работы и образование:</p>
                                                        <p className="sub-name"><b>ВУЗ: </b>{item?.university}</p>
                                                        <p className="sub-name"><b>Стаж: </b>{work_experience(item?.work_experience)}</p>
                                                        <p className="sub-name"><b>Категория: </b>{item?.get_category_display}</p>
                                                </div>
                                                <div className="consultation-time-list">
                                                        {
                                                                item?.consultation_time?.map(time => (
                                                                        <div className="bell-container" key={`time_${time?.id}`}>
                                                                                {
                                                                                        online ? (
                                                                                                <Button
                                                                                                        type="text"
                                                                                                        className="but-bell"
                                                                                                        onClick={() => handleBell(time?.id, item?.specialization_id, item, time, )}
                                                                                                >
                                                                                                        <p>Позвонить</p>
                                                                                                </Button>
                                                                                        ) : null
                                                                                }
                                                                                <div className="times">
                                                                                        <Time size={25} fill="var(--cyan)" />
                                                                                        <p>{time?.sessions_time}</p>
                                                                                </div>
                                                                                <div className="times">
                                                                                        <Wallet size={25} fill="var(--cyan)" />
                                                                                        <p>{time?.price}₸</p>
                                                                                </div>
                                                                        </div>
                                                                ))
                                                        }
                                                </div>
                                        </div>
                                ))
                        }
                </div>
        )
}

export default Specialization

const calling = (
        info: any,
        time: any,
        handleCancelCall: () => void,
        speaker: any,
        startEndTimer: Dispatch<boolean>
) => Modal.info({
        closable: false,
        width:'max(500px)',
        icon: null,
        footer: null,
        onCancel() {
                startEndTimer(false)
                handleCancelCall()
        },
        content: (
                <div className="w-100">
                        <Row justify="center" className="w-100">
                                <h4><span> Ожидание ответа от&nbsp;</span><span>{ speaker?.profile?.full_name }</span></h4>
                        </Row>
                        <Space direction="vertical">
                                <p><b>Специальность</b>: {info?.specialization?.name}</p>
                                <p><b>Сеанс</b>: {time?.sessions_time?.replace('min', ' минут')}</p>
                        </Space>
                        <Divider />
                        <Row justify="center" className="w-100">
                                <Row justify="center" style={{ maxWidth: 350 }}>
                                        <h3 style={{color: 'red',  textAlign: 'center' }}>Идёт соединение</h3>
                                </Row>
                                <Row justify="center" style={{ maxWidth: 350 }}>
                                        <p style={{color: 'red', textAlign: 'center' }}>Подождите немного - не закрывайте приложение и не блокируйте телефон</p>
                                </Row>
                                <Row justify="center" style={{ maxWidth: 350 }}>
                                        <p style={{ textAlign: 'center'}}>Время ответа спикера зависит от качества вашего интернет-соединения</p>
                                </Row>
                        </Row>
                        <br />
                        <Row justify="center">
                                <Button
                                        type="primary"
                                        className="but-bell"
                                        onClick={handleCancelCall}
                                >
                                        <div
                                                style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                }}
                                        >
                                                <PhoneOff fill="var(--premium-color)" /><p>Отклонить</p>
                                        </div>
                                </Button>
                        </Row>
                </div>
        )
})


const onCancelDoctorCall = () => Modal.info({
        closable: false,
        width: 'max(350px)',
        icon: null,
        centered: true,
        footer: null,
        content: (
                <div className="w-100">
                        <Row justify="center" className="w-100" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <p style={{color: 'red', textAlign: 'center' }}>Спикер отклонил ваш вызов</p>
                        </Row>
                        <br />
                        <Row justify="center">
                                <Button
                                        type="primary"
                                        onClick={() => Modal.destroyAll()}
                                >
                                        <div
                                                style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                }}
                                        >
                                                <span style={{ margin: '0 0 0 0.5rem', color: 'white'}}>Ок</span>
                                        </div>
                                </Button>
                        </Row>
                </div>
        )
})


const timeDetected = () => Modal.info({
        closable: false,
        width: 'max(350px)',
        icon: null,
        footer: null,
        centered: true,
        content: (
                <div className="w-100">
                        <Row justify="center" className="w-100" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                                <p style={{color: 'red', textAlign: 'center' }}>Время вызова истекло, и спикер не принял ваш вызов</p>
                        </Row>
                        <br />
                        <Row justify="center">
                                <Button
                                        type="primary"
                                        onClick={() => Modal.destroyAll()}
                                >
                                        <div
                                                style={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center'
                                                }}
                                        >
                                                <span style={{ margin: '0 0 0 0.5rem', color: 'white'}}>Ок</span>
                                        </div>
                                </Button>
                        </Row>
                </div>
        )
})