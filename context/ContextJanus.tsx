import { type FC, type ReactNode, type DispatchWithoutAction, type Dispatch, type SetStateAction, createContext, useEffect, useContext, useState, useMemo, useLayoutEffect, useRef } from "react";
import { useRouter } from "next/router";
const { v4: uuidv4 } = require('uuid')

import { message, Modal } from "antd";

import type { ICallData } from 'types/call'

import { Janus } from 'scripts/janus'
import { useUser } from "store/use-user";
import { useWeb } from "./WebSocketContext";
import { axiosInstance } from "api/api-general";
import { updateStatus } from "api/api-status";
import { ModalCallingJanus } from "components/Janus";

interface IJanus {
        visible: boolean
        videocall: any
        propsCall: ICallData | null
        setPropsCall: Dispatch<SetStateAction<ICallData | null>>
        doHangup: DispatchWithoutAction
        registerUsername: DispatchWithoutAction
}

type TProps = FC<{
        children: ReactNode
}>

export const CreateJanusContext = createContext<IJanus | null>(null)
// var localTracks: any = {}
// var localVideos = 0
// var remoteTracks: any = {}
// var remoteVideos = 0
var bitrateTimer: any = null;
var simulcastStarted = false;
var videocall: any = null;
var janus: any = null;
var jsep: any;

var trackId: any = null
var tracks: any = null

var info_id_profile: any = null
var speaker_id: any = null
var profile_id: any = null
var uuid_conf: any = null

var doSimulcast = false;

interface IValuesJanusState{
        localTracks: any
        localVideos: number
        remoteTracks: any
        remoteVideos: number
        bitrateTimer: any
        simulcastStarted: boolean
        videocall: any
        janus: any
        trackId: any
        tracks: any
        info_id_profile: any
        speaker_id: any
        profile_id: any
        uuid_conf: any
        doSimulcast: boolean
}

export const ProviderJanusContext: TProps = ({ children }) => {
        const route = useRouter()
        const [propsCall, setPropsCall] = useState<ICallData | null>(null)
        const [visible, setVisible] = useState<boolean>(false)
        const { user, is_speaker, loading } = useUser() ?? {}
        const refVideoLeft = useRef<HTMLDivElement>()
        const refVideoRight = useRef<HTMLDivElement>()
        const [dataJanusState, setDataJanusState] = useState<IValuesJanusState>({
                localTracks: {},
                localVideos: 0,
                remoteVideos: 0,
                remoteTracks: {},
                bitrateTimer: null,
                simulcastStarted: false,
                videocall: null,
                janus: null,
                trackId: null,
                tracks: null,
                info_id_profile: null,
                speaker_id: null,
                profile_id: null,
                uuid_conf: null,
                doSimulcast: false,
        })

        useEffect(() => {
                if (propsCall) {
                        info_id_profile = propsCall?.user_info?.profile_id
                        speaker_id = propsCall?.speaker_info?.profile_id
                        profile_id = propsCall?.user_info?.profile_id
                        uuid_conf = propsCall?.call_info?.uuid
                }
        }, [propsCall])

        const uuid = useMemo(() => uuidv4(), [])

        let close: boolean = false;
        let isTimer: boolean = false;

        const context = useWeb()

        const wsChannel = context?.wsChannel || undefined

        useEffect(() => {
                const listenerCall = (event: any) => {
                        const notification: ICallData = JSON.parse(event.data).data

                        if (notification?.type === "call_accept_ok") {
                                console.log('notification isSpeaker: ', notification)
                                setPropsCall({ ...notification })
                        }
                }
                if (wsChannel) {
                        wsChannel?.addEventListener('message', listenerCall)
                }

                return () => wsChannel?.removeEventListener("message", listenerCall)
        }, [wsChannel])

        useEffect(() => {
                Janus.init({
                        debug: false,
                        dependencies: Janus.useDefaultDependencies(),
                        callback: () => {
                                janus = new Janus({
                                        server: process.env.NEXT_PUBLIC_URL_WEBSOCKET_JANUS,
                                        async success() {
                                                janus.attach({
                                                        plugin: "janus.plugin.videocall",
                                                        opaqueId: uuid,
                                                        success(pluginHandle: any) {
                                                                videocall = pluginHandle
                                                        },
                                                        onmessage: onMessageHandler,
                                                        onlocaltrack: onLocalTrackHandler,
                                                        onremotetrack: onRemoteTrackHandler,
                                                        ondataopen: onDataOpenHandler,
                                                        ondata: onDataHandler,
                                                        oncleanup: onCleanUpHandler,
                                                })
                                        },
                                        error(error: any) { console.error(`---error init janus---`, error) },
                                        destroyed() { console.log("---init destroy session videocall--- ") },
                                })
                        },
                })
        }, [])

        function onMessageHandler(msg: any, jsep: any) {
                jsep = jsep
                var result = msg["result"]
                var username: any = msg?.result?.username
                console.log("record msg: ", msg)
                if (true) {
                        if (result) {
                                if (result["list"]) {
                                        var list = result["list"];
                                        for (var mp in list) {
                                                console.debug(`>>> ${list[mp]}`);
                                        }
                                } else if (result["event"]) {
                                        var event = result["event"]
                                        if (event === "registered") {
                                                console.log("registered", username)
                                                if (username?.includes("speaker")) {
                                                        console.log("on call student", info_id_profile)
                                                        const success = (jsep: any) => {
                                                                videocall.send({
                                                                        message: {
                                                                                request: "call",
                                                                                username: `student-${info_id_profile}`
                                                                        },
                                                                        jsep,
                                                                })
                                                        }
                                                        videocall.createOffer(
                                                                {
                                                                        tracks: [
                                                                                { type: 'audio', capture: true, recv: true },
                                                                                { type: 'video', capture: true, recv: true, simulcast: doSimulcast },
                                                                                { type: 'data' },
                                                                        ],
                                                                        success: success,
                                                                        error: (error: any) => {
                                                                                console.error("----WebRTC error---- ", error)
                                                                        }
                                                                })
                                                        videocall.send({
                                                                message: {
                                                                        request: "list"
                                                                }
                                                        })
                                                }
                                        } else if (event === "calling") {
                                                console.log("record calling");
                                        } else if (event === "incomingcall") {
                                                console.log("incomingcall", username)
                                                videocall.createAnswer(
                                                        {
                                                                jsep: jsep,
                                                                tracks: [
                                                                        { type: 'audio', capture: true, recv: true },
                                                                        { type: 'video', capture: true, recv: true },
                                                                        { type: 'data' },
                                                                ],
                                                                success(jsep: any) {
                                                                        videocall.send({
                                                                                message: {
                                                                                        request: "accept"
                                                                                },
                                                                                jsep: jsep
                                                                        })
                                                                },
                                                                error(error: any) {
                                                                        console.error("---WebRTC error---", error)
                                                                }
                                                        })
                                        } else if (event === "accepted") {
                                                Modal.destroyAll()
                                                setVisible(true)
                                                getTimer()
                                                var peer = escapeXmlTags(result["username"]);
                                                console.log("accepted", peer)
                                                if (!peer) {
                                                } else {
                                                }
                                                if (jsep) { videocall.handleRemoteJsep({ jsep }); }
                                                Record()
                                        } else if (event === "update") {
                                                if (jsep) {
                                                        if (jsep.type === "answer") {
                                                                videocall.handleRemoteJsep({ jsep: jsep });
                                                        } else {
                                                                videocall.createAnswer({
                                                                        jsep: jsep,
                                                                        tracks: [
                                                                                { type: 'audio', capture: true, recv: true },
                                                                                { type: 'video', capture: true, recv: true },
                                                                                { type: 'data' },
                                                                        ],
                                                                        success: function (jsep: any) {
                                                                                console.debug("Got SDP!", jsep);
                                                                                videocall.send({
                                                                                        message: {
                                                                                                request: "set"
                                                                                        },
                                                                                        jsep: jsep
                                                                                });
                                                                        },
                                                                        error: function (error: any) {
                                                                                console.error("WebRTC error:", error);
                                                                        },
                                                                });
                                                        }
                                                }
                                        } else if (event === "hangup") {
                                                console.log("hangup", username)
                                                if (!close) {
                                                        closeVideoCallTalk()
                                                                .finally(() => {
                                                                        close = true
                                                                })
                                                }
                                                if (is_speaker) { updateStatus("offline") }
                                                setVisible(false)
                                                tracks = null
                                                setDataJanusState(prev => ({ ...prev, localTracks: {} }))
                                                videocall.hangup()
                                                janus.destroy()
                                        } else if (event === "simulcast") {
                                                var substream = result["substream"];
                                                var temporal = result["temporal"];
                                                if (
                                                        (substream !== null && substream !== undefined) ||
                                                        (temporal !== null && temporal !== undefined)
                                                ) {
                                                        if (!simulcastStarted) {
                                                                simulcastStarted = true;
                                                        }
                                                }
                                        }
                                }
                        } else {
                                        console.log("event else")
                                        setVisible(false)
                                        videocall.hangup()
                                        if (bitrateTimer) clearInterval(bitrateTimer);
                                        bitrateTimer = null
                        }
                }
        }

        function onLocalTrackHandler(track: any, on: any) {
                console.log("---onLocalTrackHandler---")
                trackId = track.id.replace(/[{}]/g, "")
                let stream = dataJanusState.localTracks[trackId]
                if (!on) {
                        if (stream) {
                                try {
                                        tracks = stream.getTracks();
                                        for (var i in tracks) {
                                                var mst = tracks[i];
                                                if (mst !== null && mst !== undefined) mst.stop();
                                        }
                                } catch (e) {
                                        console.error("---random error---", e)
                                }
                        }
                        if (track.kind === "video") {
                                return
                        }
                }
                if (stream) {
                        return
                }
                const videoleftVideo = refVideoLeft.current?.querySelector("video")
                if (!videoleftVideo) {
                        setVisible(true)
                }
                if (track.kind === "audio") {

                } else {
                        stream = new MediaStream()
                        stream.addTrack(track.clone())
                        setDataJanusState(state => ({ ...state, localTracks: { ...state.localTracks, trackId: stream }, localVideos: state.localVideos + 1 }))
                        const newElementVideo = document.createElement("video")
                        newElementVideo.className = "rounded centered"
                        newElementVideo.id = `myvideo${trackId}`
                        newElementVideo.style.width = "100%"
                        newElementVideo.style.height = "100%"
                        newElementVideo.autoplay = true
                        newElementVideo.playsInline = true
                        newElementVideo.muted = true
                        refVideoLeft.current?.appendChild(newElementVideo)
                        Janus.attachMediaStream(document.getElementById(`myvideo${trackId}`), stream)
                }
        }

        function onRemoteTrackHandler(track: any, mid: any, on: any) {
                console.log("---onRemoteTrackHandler---")
                // let stream = remoteTracks[mid]
                let stream = dataJanusState.remoteTracks[mid]
                if (!on) {
                        if (stream) {
                                try {
                                        var tracks = stream.getTracks();
                                        for (var i in tracks) {
                                                var mst = tracks[i];
                                                if (mst) mst.stop();
                                        }
                                } catch (e) { console.error("---error remove tracks---", e) }
                        }
                        if (track.kind === "video") {
                                // remoteVideos--
                                setDataJanusState(state => ({
                                        ...state,
                                        remoteVideos: state.remoteVideos - 1,
                                }))
                        }
                        // delete remoteTracks[mid]
                        setDataJanusState(state => ({
                                ...state,
                                remoteTracks: {
                                        ...state.remoteTracks,
                                        mid: undefined,
                                }
                        }))
                        return
                }
                let addButtons = false
                const videorightAudio = refVideoRight?.current?.querySelector("audio")
                const videorightVideo = refVideoRight?.current?.querySelector("video")
                if (videorightAudio && videorightVideo) {
                        addButtons = true
                }
                if (track.kind === "audio") {
                        stream = new MediaStream()
                        stream.addTrack(track.clone())
                        // remoteTracks[mid] = stream
                        setDataJanusState(state => ({
                                ...state,
                                remoteTracks: {
                                        ...state.remoteTracks,
                                        mid: stream,
                                }
                        }))
                        const newAudioElement = document.createElement("audio")
                        newAudioElement.className = "hide"
                        newAudioElement.id = `peervideo${mid}`
                        newAudioElement.autoplay = true
                        refVideoRight.current?.appendChild(newAudioElement)
                        Janus.attachMediaStream(document.getElementById(`peervideo${mid}`), stream)
                } else {
                        stream = new MediaStream()
                        stream.addTrack(track.clone())
                        // remoteTracks[mid] = stream
                        setDataJanusState(state => ({
                                ...state,
                                remoteTracks: {
                                        ...state.remoteTracks,
                                        mid: stream,
                                },
                                remoteVideos: state.remoteVideos + 1,
                        }))
                        const newElementVideo = document.createElement("video")
                        newElementVideo.className = "rounded centered peervideo"
                        newElementVideo.id = `peervideo${mid}`
                        newElementVideo.style.width = "100%"
                        newElementVideo.style.height = "100%"
                        newElementVideo.autoplay = true
                        newElementVideo.playsInline = true
                        newElementVideo.muted = true
                        refVideoRight.current?.appendChild(newElementVideo)
                        Janus.attachMediaStream(document.getElementById(`peervideo${mid}`), stream)
                }
                if (!addButtons) return

        }

        function onDataOpenHandler() {
                setVisible(true)
        }

        function onDataHandler(data: any) {
        }

        function onCleanUpHandler() {
                simulcastStarted = false
                setDataJanusState(state => ({
                        ...state,
                        localVideos: 0,
                        localTracks: {},
                        simulcastStarted: false,
                        remoteVideos: 0,
                        remoteTracks: {},
                }))
                // remoteTracks = {};
                // remoteVideos = 0;
        }

        async function closeVideoCallTalk() {
                return await axiosInstance.post(
                        `/conference/done/`,
                        {
                                conf_uuid: uuid_conf,
                                status: "CALL_END",
                                completed: isTimer || true
                        },
                )
                        .then((data) => {
                                console.log("Success Call End:  ", data)
                                return data
                        })
                        .catch((e) => {
                                console.error("Error Call End: ", e)
                        })
                        .finally(() => {
                                console.log("-----Finally Call End-----");
                                route.push(`/feedback`, undefined, { shallow: true })
                                close = false
                        })
        }

        function getTimer() {
                setTimeout(() => {
                        isTimer = true
                }, 1 * 21 * 1000);
        }

        function Record() {
                setTimeout(() => {
                        console.log('__record__ __record: ', uuid_conf)
                        videocall.send({
                                message: {
                                        request: "set",
                                        record: true,
                                        filename: `/opt/janus/share/janus/recordings/${is_speaker ? speaker_id : profile_id}-${uuid_conf}`
                                },
                        });
                        message.info("Началась запись видео")
                }, 2500)
        }

        function registerUsername() {
                if (videocall !== null) {
                        videocall?.send({
                                message: {
                                        request: "register",
                                        username: `${is_speaker ? 'speaker' : 'student'}-${user?.profile?.profile_id}`,
                                }
                        })
                }
        }

        function doHangup() {
                for (var i in tracks) {
                        var mst = tracks[i];
                        if (mst !== null && mst !== undefined) mst.stop();
                }
                setVisible(false)
                videocall.send({
                        message: {
                                request: "hangup",
                        },
                });
                videocall.hangup();
                setTimeout(() => {
                        isTimer = false
                }, 5000)
        }

        return (
                <CreateJanusContext.Provider value={{
                        visible: visible,
                        videocall: videocall,
                        propsCall: propsCall,
                        doHangup: doHangup,
                        registerUsername: registerUsername,
                        setPropsCall: setPropsCall,
                }}>
                        {children}
                        <ModalCallingJanus
                                visible={visible}
                                videocall={videocall}
                                propsCall={propsCall}
                                doHangup={doHangup}
                                //@ts-ignore
                                refVideoLeft={refVideoLeft}
                                //@ts-ignore
                                refVideoRight={refVideoRight}
                        />
                </CreateJanusContext.Provider>
        )
}

function escapeXmlTags(value: any) {
        return value
}