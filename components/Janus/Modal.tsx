import { type FC, type DispatchWithoutAction, useState, useEffect, useContext, MutableRefObject } from 'react'
import { shallow } from 'zustand/shallow'

import type { ICallData } from 'types/call'

import Video from 'components/icons/video'
import PhoneOff from 'components/icons/phone-off'
import Microphone from 'components/icons/microphone'
import MicrophoneOff from 'components/icons/microphone-off'
import VideoOff from 'components/icons/video-off'
import { TimerSession } from './timer-session'
import { useCallJanus, usePropsCallingJanus } from 'store/use-call-janus'

import { useUser } from 'store/use-user'

interface IProps {
        visible: boolean
        videocall: any
        doHangup: DispatchWithoutAction
        refVideoLeft: MutableRefObject<HTMLDivElement | null>
        refVideoRight: MutableRefObject<HTMLDivElement | null>
}

export const ModalCallingJanus: FC<IProps> = ({ visible, videocall, doHangup, refVideoLeft, refVideoRight }) => {
        const [toggleAudio, setToggleAudio] = useState<boolean>(true)
        const [toggleVideo, setToggleVideo] = useState<boolean>(true)
        const { speaker_info, user_info, } = usePropsCallingJanus(state => ({
                call_info: state.call_info,
                speaker_info: state.speaker_info,
                user_info: state.user_info,
        }), shallow)

        const { isSpeaker } = useUser(state => ({
                isSpeaker: state.is_speaker,
        }), shallow)

        const { currentTime } = useCallJanus(state => ({
                currentTime: state.currentTime,
        }), shallow)

        return (
                <div className={`modal_janus ${visible && "visible_janus"}`}>
                        <div className={`container_video ${visible && "visible_janus"}`} id="videocall">
                                <div className="panel-body" id="videoright" ref={refVideoRight} />
                                <div className='partner_text'>
                                        {
                                                isSpeaker
                                                        ?
                                                        user_info?.full_name
                                                        :
                                                        speaker_info?.full_name
                                        }
                                        &nbsp;&nbsp;<TimerSession {...{ visible, doHangup, isSpeaker }} />
                                </div>
                                <div className="panel-body" id="videoleft" ref={refVideoLeft} />
                                <div className="btn-group btn-group-xs pull-right hide btn_group">
                                        <button
                                                className={`btn btn__`}
                                                id="toggleaudio"
                                                style={{
                                                        borderRadius: 50,
                                                        padding: '6px 16px',
                                                        color: "#fff",
                                                }}
                                                onClick={() => {
                                                        if (toggleAudio) {
                                                                videocall?.muteAudio()
                                                        } else {
                                                                videocall?.unmuteAudio()
                                                        }
                                                        setToggleAudio(!toggleAudio)
                                                }}
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
                                                (isSpeaker || currentTime! >= 59 * 20)
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