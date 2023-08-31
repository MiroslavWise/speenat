import {
    type FC,
    type DispatchWithoutAction,
    useState,
    useEffect,
    useContext,
    MutableRefObject,
    Dispatch,
} from "react";
import { shallow } from "zustand/shallow";

import { TimerSession } from "./timer-session";
import { useCallJanus, usePropsCallingJanus } from "store/use-call-janus";

import { useUser } from "store/use-user";

import styles from "./style.module.scss";
import { cx } from "functions/cx";
import Image from "next/image";

interface IProps {
    visible: boolean;
    videocall: any;
    doHangup: DispatchWithoutAction;
    refVideoLeft: MutableRefObject<HTMLDivElement | null>;
    refVideoRight: MutableRefObject<HTMLDivElement | null>;
    publishOwnFeed: Dispatch<{ useAudio: boolean; useVideo: boolean }>;
    updatedVideoAudio: Dispatch<{ isAudio: boolean; isVideo: boolean }>;
}

export const ModalCallingJanus: FC<IProps> = ({
    visible,
    videocall,
    doHangup,
    refVideoLeft,
    refVideoRight,
    publishOwnFeed,
}) => {
    const [toggleAudio, setToggleAudio] = useState<boolean>(true);
    const [toggleVideo, setToggleVideo] = useState<boolean>(true);
    const { speaker_info, user_info, call_info } = usePropsCallingJanus(
        (state) => ({
            call_info: state.call_info,
            speaker_info: state.speaker_info,
            user_info: state.user_info,
        }),
        shallow,
    );

    const { isSpeaker } = useUser(
        (state) => ({
            isSpeaker: state.is_speaker,
        }),
        shallow,
    );

    return (
        <div className={`modal_janus ${visible && "visible_janus"}`}>
            <div
                className={`container_video ${visible && "visible_janus"}`}
                id="videocall"
            >
                <div
                    className="panel-body"
                    id="videoright"
                    ref={refVideoRight}
                />
                <div className="partner_text">
                    {/* {isSpeaker ? user_info?.full_name : speaker_info?.full_name}
                    &nbsp;&nbsp; */}
                    <TimerSession {...{ visible, doHangup, isSpeaker }} />
                </div>
                <div className="panel-body" id="videoleft" ref={refVideoLeft} />
                <div className={styles.btnGroup}>
                    <div
                        id="toggleaudio"
                        className={cx(
                            styles.toggleCircle,
                            !toggleAudio && styles.active,
                        )}
                        onClick={() => {
                            if (toggleAudio) {
                                videocall.send({
                                    request: "pause",
                                });
                            } else {
                                videocall.send({
                                    request: "start",
                                });
                            }
                            setToggleAudio((prev) => !prev);
                        }}
                    >
                        <Image
                            src={toggleAudio ? "/call-svg/microphone-on.svg" : "/call-svg/microphone-off.svg"}
                            alt="micro-on"
                            width={31}
                            height={31}
                        />
                    </div>
                    <div
                        id="calloff"
                        className={cx(styles.toggleCircle, styles.callOff)}
                        onClick={doHangup}
                    >
                        <Image
                            src="/call-svg/phone-hang-up.svg"
                            alt="micro-on"
                            width={31}
                            height={31}
                        />
                    </div>
                    <div
                        id="togglevideo"
                        className={cx(
                            styles.toggleCircle,
                            !toggleVideo && styles.active,
                        )}
                        onClick={() => {
                            if (toggleVideo) {
                                videocall.send({
                                    message: {
                                        request: "unpublish",
                                    },
                                });
                                publishOwnFeed({
                                    useAudio: false,
                                    useVideo: false,
                                });
                            } else {
                                publishOwnFeed({
                                    useAudio: true,
                                    useVideo: true,
                                });
                            }
                            setToggleVideo((prev) => !prev);
                        }}
                    >
                        <Image
                            src={toggleVideo ? "/call-svg/video-recorder-on.svg" : "/call-svg/video-recorder-off.svg"}
                            alt="micro-on"
                            width={31}
                            height={31}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
