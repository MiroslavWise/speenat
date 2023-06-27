import { type FC, type DispatchWithoutAction, useState, useEffect, useContext } from 'react'
import { shallow } from 'zustand/shallow'

import type { ICallData } from 'types/call'

import Video from 'components/icons/video'
import PhoneOff from 'components/icons/phone-off'
import Microphone from 'components/icons/microphone'
import MicrophoneOff from 'components/icons/microphone-off'
import VideoOff from 'components/icons/video-off'
import { TimerSession } from './timer-session'

import { useUser } from 'store/use-user'

interface IProps {
        visible: boolean
        videocall: any
        propsCall: ICallData | null
        doHangup: DispatchWithoutAction
}

export const ModalCallingJanus: FC<IProps> = ({ visible, videocall, propsCall, doHangup }) => {
        const [toggleAudio, setToggleAudio] = useState<boolean>(true)
        const [toggleVideo, setToggleVideo] = useState<boolean>(true)
        const [time, setTime] = useState<any>(20 * 60)

        const { isSpeaker } = useUser(state => ({
                isSpeaker: state.is_speaker,
        }), shallow)

        useEffect(() => {
                if (visible) {
                        videocall.send({
                                message: { request: "set", audio: toggleAudio },
                        });
                }
        }, [toggleAudio])

        useEffect(() => {
                if (visible) {
                        videocall.send({
                                message: { request: "set", video: toggleVideo },
                        });
                }
        }, [toggleVideo])

        return (
                <div className={`modal_janus ${visible && "visible_janus"}`}>
                        <div className={`container_video ${visible && "visible_janus"}`} id="videocall">
                                <div className="panel-body" id="videoright" />
                                <div className='partner_text'>
                                        {
                                                isSpeaker
                                                        ?
                                                        propsCall?.user_info?.full_name
                                                        :
                                                        propsCall?.speaker_info?.full_name
                                        }
                                        &nbsp;&nbsp;<TimerSession {...{ visible, doHangup, time, setTime, isSpeaker }} />
                                </div>
                                <div className="panel-body" id="videoleft" />
                                <div className="btn-group btn-group-xs pull-right hide btn_group">
                                        <button
                                                className={`btn btn__`}
                                                id="toggleaudio"
                                                style={{
                                                        borderRadius: 50,
                                                        padding: '6px 16px',
                                                        color: "#fff",
                                                }}
                                                onClick={() => { setToggleAudio(!toggleAudio) }}
                                        >
                                                {
                                                        toggleAudio
                                                                ?
                                                                <Microphone />
                                                                :
                                                                <MicrophoneOff />
                                                }
                                        </button>
                                        {
                                                (isSpeaker || time >= 59 * 20)
                                                &&
                                                <button
                                                        className="btn btn__"
                                                        id="calloff"
                                                        onClick={doHangup}
                                                        style={{
                                                                borderRadius: 50,
                                                                padding: '6px 16px',
                                                                color: "#fff",
                                                                backgroundColor: "#CA0B00"
                                                        }}
                                                >
                                                        <PhoneOff fill='#fff' />
                                                </button>
                                        }
                                        <button
                                                className={`btn  btn__`}
                                                id="togglevideo"
                                                style={{
                                                        borderRadius: 50,
                                                        padding: '6px 16px',
                                                        color: "#fff",
                                                }}
                                                onClick={() => { setToggleVideo(!toggleVideo) }}
                                        >
                                                {
                                                        toggleVideo
                                                                ?
                                                                <Video />
                                                                :
                                                                <VideoOff />
                                                }

                                        </button>
                                </div>
                        </div>
                </div>
        )
}