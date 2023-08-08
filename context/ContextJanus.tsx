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

var janus = null;
var sfutest: any = null;
var stream: any
var myroom = 1234;	// Demo room
if (getQueryStringValue("room") !== "")
        myroom = parseInt(getQueryStringValue("room"));
var myusername: any = null;
var myid = null;
var mystream: any = null;
// We use this other ID just to map our subscriptions to us
var mypvtid: any = null;

var localTracks: any = {}, localVideos = 0;
var feeds: any[] = [], feedStreams: any = {};
var bitrateTimer: any

var doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true")
var doSvc = getQueryStringValue("svc")
if (doSvc === "") {
        doSvc = ""
}
var acodec = (getQueryStringValue("acodec") !== "" ? getQueryStringValue("acodec") : null)
var vcodec = (getQueryStringValue("vcodec") !== "" ? getQueryStringValue("vcodec") : null)
var doDtx = (getQueryStringValue("dtx") === "yes" || getQueryStringValue("dtx") === "true");
var subscriber_mode = (getQueryStringValue("subscriber-mode") === "yes" || getQueryStringValue("subscriber-mode") === "true");
var use_msid = (getQueryStringValue("msid") === "yes" || getQueryStringValue("msid") === "true");

interface IValuesJanusState {
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
                                                        // plugin: "janus.plugin.videoroom",
                                                        plugin: "janus.plugin.videocall",
                                                        opaqueId: uuid,
                                                        success(pluginHandle: any) {
                                                                videocall = pluginHandle
                                                                sfutest = pluginHandle
                                                        },
                                                        onmessage: onMessageHandler_,
                                                        onlocaltrack: onLocalTrackHandler,
                                                        onremotetrack: onRemoteTrackHandler,
                                                        ondataopen: onDataOpenHandler,
                                                        ondata: onDataHandler,
                                                        oncleanup: onCleanUpHandler,
                                                        webrtcState: function (on: any) {
                                                                if (!on) return
                                                        }
                                                })
                                        },
                                        error(error: any) { console.error(`---error init janus---`, error) },
                                        destroyed() {
                                                console.log("---init destroy session videocall--- ")
                                        },
                                })
                        },
                })
        }, [])
        function onMessageHandler(msg: any, jsep: any) {
                let event = msg["videoroom"]
                if (event) {
                        if (event === "joined") {
                                myid = msg["id"]
                                mypvtid = msg["private_id"]
                                if (subscriber_mode) {
                                        if (msg["publishers"]) {
                                                let list = msg["publishers"]
                                                for (let f in list) {
                                                        if (list[f]["dummy"])
                                                                continue;
                                                        let id = list[f]["id"];
                                                        let streams = list[f]["streams"];
                                                        let display = list[f]["display"];
                                                        for (let i in streams) {
                                                                let stream = streams[i];
                                                                stream["id"] = id;
                                                                stream["display"] = display;
                                                        }
                                                        feedStreams[id] = streams;
                                                        newRemoteFeed(id, display, streams, uuid);
                                                }
                                        }
                                } else if (event === "destroyed") {
                                        window.location.reload()
                                } else if (event === "event") {
                                        if (msg["streams"]) {
                                                let streams = msg["streams"]
                                                for (let i in streams) {
                                                        let stream = streams[i]
                                                        stream["id"] = myid
                                                        stream["display"] = myusername
                                                }
                                                feedStreams[myid] = streams;
                                        } else if (msg["publishers"]) {
                                                let list = msg["publishers"]
                                                for (let f in list) {
                                                        if (list[f]["dummy"])
                                                                continue;
                                                        let id = list[f]["id"]
                                                        let display = list[f]["display"]
                                                        let streams = list[f]["streams"]
                                                        for (let i in streams) {
                                                                let stream = streams[i]
                                                                stream["id"] = id
                                                                stream["display"] = display
                                                        }
                                                        feedStreams[id] = streams;
                                                        newRemoteFeed(id, display, streams, uuid)
                                                }
                                        } else if (msg["leaving"]) {
                                                let leaving = msg["leaving"]
                                                let remoteFeed = null
                                                for (let i = 1; i < 6; i++) {
                                                        if (feeds[i] && feeds[i].rfid == leaving) {
                                                                remoteFeed = feeds[i]
                                                                break;
                                                        }
                                                }
                                                if (remoteFeed) {
                                                        // $('#remote' + remoteFeed.rfindex).empty().hide();
                                                        // $('#videoremote' + remoteFeed.rfindex).empty();
                                                        feeds[remoteFeed.rfindex] = null
                                                        remoteFeed.detach()
                                                }
                                                delete feedStreams[leaving];
                                        } else if (msg["unpublished"]) {
                                                let unpublished = msg["unpublished"]
                                                if (unpublished === 'ok') {
                                                        sfutest.hangup()
                                                        return;
                                                }
                                                let remoteFeed = null
                                                for (let i = 1; i < 6; i++) {
                                                        if (feeds[i] && feeds[i].rfid == unpublished) {
                                                                remoteFeed = feeds[i]
                                                                break;
                                                        }
                                                }
                                                if (remoteFeed) {
                                                        // $('#remote' + remoteFeed.rfindex).empty().hide();
                                                        // $('#videoremote' + remoteFeed.rfindex).empty();
                                                        feeds[remoteFeed.rfindex] = null;
                                                        remoteFeed.detach();
                                                }
                                                delete feedStreams[unpublished];
                                        } else if (msg["error"]) {
                                                if (msg["error_code"] === 426) {
                                                        console.log("---ERROR msg[error] 426 ---", msg["error"])
                                                } else {
                                                        console.log("---ERROR msg[error] ---", msg["error"])
                                                }
                                        }
                                }
                        }
                }

                if (jsep) {
                        sfutest.handleRemoteJsep({ jsep: jsep });
                        let audio = msg["audio_codec"];
                        if (mystream && mystream.getAudioTracks() && mystream.getAudioTracks().length > 0 && !audio) {
                                // Audio has been rejected
                                // toastr.warning("Our audio stream has been rejected, viewers won't hear us");
                        }
                        let video = msg["video_codec"];
                        if (mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {
                                // toastr.warning("Our video stream has been rejected, viewers won't see us")
                                // Hide the webcam video
                                // $('#myvideo').hide();
                                // $('#videolocal').append(
                                //         '<div class="no-video-container">' +
                                //                 '<i class="fa fa-video-camera fa-5 no-video-icon" style="height: 100%;"></i>' +
                                //                 '<span class="no-video-text" style="font-size: 16px;">Video rejected, no webcam</span>' +
                                //         '</div>');
                        }
                }
        }

        // function onLocalTrackHandler(track: any, on: any) {
        //         let trackId = track.id.replace(/[{}]/g, "");
        //         if (!on) {
        //                 let stream = localTracks[trackId];
        //                 if (stream) {
        //                         try {
        //                                 let tracks = stream.getTracks();
        //                                 for (let i in tracks) {
        //                                         let mst = tracks[i];
        //                                         if (mst !== null && mst !== undefined)
        //                                                 mst.stop();
        //                                 }
        //                         } catch (e) { }
        //                 }
        //                 if (track.kind === "video") {
        //                         // $('#myvideo' + trackId).remove()
        //                         localVideos--
        //                         if (localVideos === 0) {
        //                                 // if ($('#videolocal .no-video-container').length === 0) {
        //                                 //         $('#videolocal').append(
        //                                 //                 '<div class="no-video-container">' +
        //                                 //                 '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
        //                                 //                 '<span class="no-video-text">No webcam available</span>' +
        //                                 //                 '</div>');
        //                                 // }
        //                         }
        //                 }
        //                 delete localTracks[trackId]
        //                 return;
        //         }
        //         let stream = localTracks[trackId];
        //         if (stream) {
        //                 return;
        //         }
        //         // $('#videos').removeClass('hide').show()
        //         // if ($('#mute').length === 0) {
        //         //         $('#videolocal').append('<button class="btn btn-warning btn-xs" id="mute" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;">Mute</button>')
        //         //         $('#mute').click(toggleMute)
        //         //         $('#videolocal').append('<button class="btn btn-warning btn-xs" id="unpublish" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;">Unpublish</button>')
        //         //         $('#unpublish').click(unpublishOwnFeed)
        //         // }
        //         if (track.kind === "audio") {
        //                 if (localVideos === 0) {
        //                         // if ($('#videolocal .no-video-container').length === 0) {
        //                         //         $('#videolocal').append(
        //                         //                 '<div class="no-video-container">' +
        //                         //                 '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
        //                         //                 '<span class="no-video-text">No webcam available</span>' +
        //                         //                 '</div>');
        //                         // }
        //                 }
        //         } else {
        //                 localVideos++;
        //                 // $('#videolocal .no-video-container').remove()
        //                 stream = new MediaStream([track])
        //                 localTracks[trackId] = stream
        //                 // $('#videolocal').append('<video class="rounded centered" id="myvideo' + trackId + '" width=100% autoplay playsinline muted="muted"/>');
        //         }
        //         if (sfutest.webrtcStuff.pc.iceConnectionState !== "completed" &&
        //                 sfutest.webrtcStuff.pc.iceConnectionState !== "connected") {
        //                 // $("#videolocal").parent().parent().block({
        //                 //         message: '<b>Publishing...</b>',
        //                 //         css: {
        //                 //                 border: 'none',
        //                 //                 backgroundColor: 'transparent',
        //                 //                 color: 'white'
        //                 //         }
        //                 // });
        //         }
        // }

        function onMessageHandler_(msg: any, jsep: any) {
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

function getQueryStringValue(name: string) {
        return name
}

function newRemoteFeed(id: any, display: any, streams: any, opaqueId: any) {
        let remoteFeed: any = null;
        if (!streams)
                streams = feedStreams[id];
        janus.attach(
                {
                        plugin: "janus.plugin.videoroom",
                        opaqueId: opaqueId,
                        success: function (pluginHandle: any) {
                                remoteFeed = pluginHandle;
                                remoteFeed.remoteTracks = {};
                                remoteFeed.remoteVideos = 0;
                                remoteFeed.simulcastStarted = false;
                                remoteFeed.svcStarted = false;
                                let subscription = [];
                                for (let i in streams) {
                                        let stream = streams[i];
                                        // If the publisher is VP8/VP9 and this is an older Safari, let's avoid video
                                        //@ts-ignore
                                        if (stream.type === "video" && Janus.webRTCAdapter.browserDetails.browser === "safari" &&
                                                //@ts-ignore
                                                ((stream.codec === "vp9" && !Janus.safariVp9) || (stream.codec === "vp8" && !Janus.safariVp8))) {
                                                //@ts-ignore
                                                toastr.warning("Publisher is using " + stream.codec.toUpperCase +
                                                        ", but Safari doesn't support it: disabling video stream #" + stream.mindex);
                                                continue;
                                        }
                                        subscription.push({
                                                feed: stream.id,	// This is mandatory
                                                mid: stream.mid		// This is optional (all streams, if missing)
                                        });
                                        // FIXME Right now, this is always the same feed: in the future, it won't
                                        remoteFeed.rfid = stream.id;
                                        remoteFeed.rfdisplay = escapeXmlTags(stream.display);
                                }
                                // We wait for the plugin to send us an offer
                                let subscribe = {
                                        request: "join",
                                        room: myroom,
                                        ptype: "subscriber",
                                        streams: subscription,
                                        use_msid: use_msid,
                                        private_id: mypvtid
                                };
                                remoteFeed.send({ message: subscribe });
                        },
                        error: function (error: any) {
                                console.error("ERROR JANUS FUNCTION: ", error)
                        },
                        iceState: function (state: any) {
                        },
                        webrtcState: function (on: any) {
                        },
                        slowLink: function (uplink: any, lost: any, mid: any) {
                        },
                        onmessage: function (msg: any, jsep: any) {
                                let event = msg["videoroom"]
                                if (msg["error"]) {
                                        console.error("---ERROR msg[error]---", msg["error"])
                                } else if (event) {
                                        if (event === "attached") {
                                                // Subscriber created and attached
                                                for (let i = 1; i < 6; i++) {
                                                        if (!feeds[i]) {
                                                                feeds[i] = remoteFeed;
                                                                remoteFeed.rfindex = i;
                                                                break;
                                                        }
                                                }
                                                if (!remoteFeed.spinner) {
                                                } else {
                                                        remoteFeed.spinner.spin();
                                                }
                                        } else if (event === "event") {
                                                let substream = msg["substream"];
                                                let temporal = msg["temporal"];
                                                if ((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                                                        if (!remoteFeed.simulcastStarted) {
                                                                remoteFeed.simulcastStarted = true;
                                                        }
                                                }
                                                // Or maybe SVC?
                                                let spatial = msg["spatial_layer"];
                                                temporal = msg["temporal_layer"];
                                                if ((spatial !== null && spatial !== undefined) || (temporal !== null && temporal !== undefined)) {
                                                        if (!remoteFeed.svcStarted) {
                                                                remoteFeed.svcStarted = true
                                                        }
                                                }
                                        } else {
                                        }
                                }
                                if (jsep) {
                                        let stereo = (jsep.sdp.indexOf("stereo=1") !== -1)
                                        remoteFeed.createAnswer(
                                                {
                                                        jsep: jsep,
                                                        tracks: [
                                                                { type: 'data' }
                                                        ],
                                                        customizeSdp: function (jsep: any) {
                                                                if (stereo && jsep.sdp.indexOf("stereo=1") == -1) {
                                                                        jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;stereo=1");
                                                                }
                                                        },
                                                        success: function (jsep: any) {
                                                                let body = { request: "start", room: myroom };
                                                                remoteFeed.send({ message: body, jsep: jsep });
                                                        },
                                                        error: function (error: any) {
                                                                console.error("---ERROR FUNCTION STEREO---", error)
                                                        }
                                                });
                                }
                        },
                        onlocaltrack: function (track: any, on: any) {
                        },
                        onremotetrack: function (track: any, mid: any, on: any, metadata: any) {
                                if (!on) {
                                        if (track.kind === "video") {
                                                remoteFeed.remoteVideos--;
                                                if (remoteFeed.remoteVideos === 0) {
                                                }
                                        }
                                        delete remoteFeed.remoteTracks[mid];
                                        return;
                                }
                                if (remoteFeed.spinner) {
                                        remoteFeed.spinner.stop();
                                        remoteFeed.spinner = null;
                                }
                                // if ($('#remotevideo' + remoteFeed.rfindex + '-' + mid).length > 0)
                                //         return;
                                if (track.kind === "audio") {
                                        let stream = new MediaStream([track]);
                                        remoteFeed.remoteTracks[mid] = stream;
                                        // $('#videoremote' + remoteFeed.rfindex).append('<audio class="hide" id="remotevideo' + remoteFeed.rfindex + '-' + mid + '" autoplay playsinline/>');
                                        // Janus.attachMediaStream($('#remotevideo' + remoteFeed.rfindex + '-' + mid).get(0), stream);
                                        if (remoteFeed.remoteVideos === 0) {
                                                // if ($('#videoremote' + remoteFeed.rfindex + ' .no-video-container').length === 0) {
                                                //         $('#videoremote' + remoteFeed.rfindex).append(
                                                //                 '<div class="no-video-container">' +
                                                //                 '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                                //                 '<span class="no-video-text">No remote video available</span>' +
                                                //                 '</div>');
                                                // }
                                        }
                                } else {
                                        // New video track: create a stream out of it
                                        remoteFeed.remoteVideos++;
                                        // $('#videoremote' + remoteFeed.rfindex + ' .no-video-container').remove();
                                        let stream = new MediaStream([track])
                                        remoteFeed.remoteTracks[mid] = stream
                                        // $('#videoremote' + remoteFeed.rfindex).append('<video class="rounded centered" id="remotevideo' + remoteFeed.rfindex + '-' + mid + '" width=100% autoplay playsinline/>');
                                        // $('#videoremote' + remoteFeed.rfindex).append(
                                        //         '<span class="label label-primary hide" id="curres' + remoteFeed.rfindex + '" style="position: absolute; bottom: 0px; left: 0px; margin: 15px;"></span>' +
                                        //         '<span class="label label-info hide" id="curbitrate' + remoteFeed.rfindex + '" style="position: absolute; bottom: 0px; right: 0px; margin: 15px;"></span>');
                                        // Janus.attachMediaStream($('#remotevideo' + remoteFeed.rfindex + '-' + mid).get(0), stream)
                                        // Note: we'll need this for additional videos too
                                }
                        },
                        oncleanup: function () {
                                if (remoteFeed.spinner)
                                        remoteFeed.spinner.stop();
                                remoteFeed.spinner = null;
                                // $('#remotevideo' + remoteFeed.rfindex).remove();
                                // $('#waitingvideo' + remoteFeed.rfindex).remove();
                                // $('#novideo' + remoteFeed.rfindex).remove();
                                // $('#curres' + remoteFeed.rfindex).remove();
                                if (bitrateTimer[remoteFeed.rfindex])
                                        clearInterval(bitrateTimer[remoteFeed.rfindex]);
                                bitrateTimer[remoteFeed.rfindex] = null;
                                remoteFeed.simulcastStarted = false;
                                // $('#simulcast' + remoteFeed.rfindex).remove();
                                remoteFeed.remoteTracks = {};
                                remoteFeed.remoteVideos = 0;
                        }
                });
}