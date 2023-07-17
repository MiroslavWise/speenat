import { type FC, type ReactNode, type DispatchWithoutAction, type Dispatch, type SetStateAction, createContext, useEffect, useContext, useState, useMemo, useLayoutEffect } from "react";
import { useRouter } from "next/router";

const $ = require('jquery')
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
var opaqueId = "videocall-" + Janus.randomString(12);
var localTracks: any = {}
var localVideos = 0
var remoteTracks: any = {}
var remoteVideos = 0
var bitrateTimer: any = null;
var spinner: any = null;
var simulcastStarted = false;
var videocall: any = null;
var janus: any = null;

var trackId: any = null
var tracks: any = null

var info_id_profile: any = null
var is_speaker: any = null
var speaker_id: any = null
var profile_id: any = null
var uuid_conf: any = null

var doSimulcast = true;

export const ProviderJanusContext: TProps = ({ children }) => {
        const route = useRouter()
        const [propsCall, setPropsCall] = useState<ICallData | null>(null)
        const [visible, setVisible] = useState<boolean>(false)
        const [REGISTER, setREGISTER] = useState<boolean>(false)
        const { user, is_speaker, loading } = useUser() ?? {}

        useEffect(() => {
                if (propsCall) {
                        info_id_profile = propsCall?.user_info?.profile_id
                        speaker_id = propsCall?.speaker_info?.profile_id
                        profile_id = propsCall?.user_info?.profile_id
                        uuid_conf = propsCall?.call_info?.uuid
                }
        }, [propsCall])

        let close: boolean = false;
        let isTimer: boolean = false;

        useEffect(() => {
                console.log('__record__ __uuid: ', propsCall?.call_info?.uuid)
                console.log('__record__ __propsCall: ', propsCall?.call_info?.uuid)
        }, [propsCall])

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
                Janus?.init({
                        debug: false,
                        callback: function () {
                                janus = new Janus({
                                        server: "wss://meeting.consudoc.online",
                                        success: async function () {
                                                console.log("---init async session--- ")
                                                janus.attach({
                                                        plugin: "janus.plugin.videocall",
                                                        opaqueId: opaqueId,
                                                        success: function (pluginHandle: any) {
                                                                console.log("---init session videocall--- ")
                                                                videocall = pluginHandle;
                                                        },
                                                        onmessage: function (msg: any, jsep: any) {
                                                                jsep = jsep
                                                                console.log("record msg: ", msg)
                                                                var result = msg["result"];
                                                                if (result) {
                                                                        if (result["list"]) {
                                                                                var list = result["list"];
                                                                                for (var mp in list) {
                                                                                        console.debug(`>>> ${list[mp]}`);
                                                                                }
                                                                        } else if (result["event"]) {
                                                                                var event = result["event"];
                                                                                if (event === "registered") {
                                                                                        if (msg?.result?.username?.includes('speaker')) {
                                                                                                console.log('speaker: ', info_id_profile)
                                                                                                const success = (jsep: any) => {
                                                                                                        videocall.send({
                                                                                                                message: {
                                                                                                                        request: "call",
                                                                                                                        username: `student-${info_id_profile}`
                                                                                                                },
                                                                                                                jsep
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
                                                                                                                        console.error("WebRTC error...", error)
                                                                                                                }
                                                                                                        });
                                                                                        }
                                                                                        videocall.send({
                                                                                                message: {
                                                                                                        request: "list"
                                                                                                }
                                                                                        });
                                                                                } else if (event === "calling") {
                                                                                        console.log("record calling");
                                                                                } else if (event === "incomingcall") {
                                                                                        videocall.createAnswer(
                                                                                                {
                                                                                                        jsep: jsep,
                                                                                                        tracks: [
                                                                                                                { type: 'audio', capture: true, recv: true },
                                                                                                                { type: 'video', capture: true, recv: true },
                                                                                                                { type: 'data' },
                                                                                                        ],
                                                                                                        success: function (jsep: any) {
                                                                                                                console.log("incomingcall")
                                                                                                                videocall.send({
                                                                                                                        message: {
                                                                                                                                request: "accept"
                                                                                                                        },
                                                                                                                        jsep: jsep
                                                                                                                })
                                                                                                        },
                                                                                                        error: function (error: any) {
                                                                                                                console.error("WebRTC error:", error);
                                                                                                        }
                                                                                                });
                                                                                } else if (event === "accepted") {
                                                                                        setVisible(true)
                                                                                        Modal.destroyAll()
                                                                                        getTimer()
                                                                                        // stop()
                                                                                        var peer = escapeXmlTags(result["username"]);
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
                                                                                        if (!close) {
                                                                                                closeVideoCallTalk().then((data: any) => { console.log('object __r: ', data); })
                                                                                                close = true
                                                                                        }
                                                                                        $("#myvideo" + trackId).remove()
                                                                                        $("#myvideo").remove()
                                                                                        if (is_speaker) {
                                                                                                console.log(" ---update status is_speaker offline--- ")
                                                                                                updateStatus("offline")
                                                                                        }
                                                                                        route.push(`/feedback`, undefined, { shallow: true })
                                                                                        setVisible(false)
                                                                                        tracks = null
                                                                                        localTracks = {}
                                                                                        videocall.hangup();
                                                                                        janus.destroy();
                                                                                        if (spinner) spinner.stop();
                                                                                        $("#videos").hide();
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
                                                                        var error = msg["error"];
                                                                        setVisible(false)
                                                                        videocall.hangup();
                                                                        if (spinner) spinner.stop();
                                                                        $("#videos").hide();
                                                                        if (bitrateTimer) clearInterval(bitrateTimer);
                                                                        bitrateTimer = null;
                                                                }
                                                        },
                                                        onlocaltrack: function (track: any, on: any) {
                                                                trackId = track.id.replace(/[{}]/g, "");
                                                                if (!on) {
                                                                        var stream = localTracks[trackId]
                                                                        if (stream) {
                                                                                try {
                                                                                        tracks = stream.getTracks();
                                                                                        for (var i in tracks) {
                                                                                                var mst = tracks[i];
                                                                                                if (mst !== null && mst !== undefined) mst.stop();
                                                                                        }
                                                                                } catch (e) {
                                                                                        console.error('random error: ', e)
                                                                                }
                                                                        }
                                                                        if (track.kind === "video") {
                                                                                $("#myvideo" + trackId).remove();
                                                                                localVideos--;
                                                                                for (var i in tracks) {
                                                                                        var mst = tracks[i];
                                                                                        if (mst !== null && mst !== undefined) mst.stop();
                                                                                }
                                                                                if (localVideos === 0) {
                                                                                        if ($("#videoleft .no-video-container").length === 0) {
                                                                                        }
                                                                                }
                                                                        }
                                                                        delete localTracks[trackId];
                                                                        return;
                                                                }
                                                                var stream = localTracks[trackId];
                                                                if (stream) {
                                                                        return;
                                                                }
                                                                if ($("#videoleft video").length === 0) {
                                                                        $("#videos").removeClass("hide").show();
                                                                }
                                                                if (track.kind === "audio") {
                                                                        if (localVideos === 0) {
                                                                                if ($("#videoleft .no-video-container").length === 0) {
                                                                                }
                                                                        }
                                                                } else {
                                                                        localVideos++;
                                                                        $("#videoleft .no-video-container").remove();
                                                                        stream = new MediaStream();
                                                                        stream.addTrack(track.clone());
                                                                        localTracks[trackId] = stream;
                                                                        $("#videoleft").append(
                                                                                '<video className="rounded centered" id="myvideo' +
                                                                                trackId +
                                                                                '" width="100%" height="100%" autoplay playsinline border-radius="10px" muted="muted"/>'
                                                                        );
                                                                        Janus.attachMediaStream(
                                                                                $("#myvideo" + trackId).get(0),
                                                                                stream
                                                                        );
                                                                }
                                                                if (
                                                                        videocall.webrtcStuff.pc.iceConnectionState !== "completed" &&
                                                                        videocall.webrtcStuff.pc.iceConnectionState !== "connected"
                                                                ) {
                                                                }
                                                        },
                                                        onremotetrack: function (track: any, mid: any, on: any) {
                                                                if (!on) {
                                                                        var stream = remoteTracks[mid];
                                                                        if (stream) {
                                                                                try {
                                                                                        var tracks = stream.getTracks();
                                                                                        for (var i in tracks) {
                                                                                                var mst = tracks[i];
                                                                                                if (mst) mst.stop();
                                                                                        }
                                                                                } catch (e) { }
                                                                        }
                                                                        $("#peervideo" + mid).remove();
                                                                        if (track.kind === "video") {
                                                                                remoteVideos--;
                                                                                if (remoteVideos === 0) {
                                                                                        if ($("#videoright .no-video-container").length === 0) {
                                                                                        }
                                                                                }
                                                                        }
                                                                        delete remoteTracks[mid];
                                                                        return;
                                                                }
                                                                let addButtons = false;
                                                                if (
                                                                        $("#videoright audio").length === 0 &&
                                                                        $("#videoright video").length === 0
                                                                ) {
                                                                        addButtons = true;
                                                                        $("#videos").removeClass("hide").show();
                                                                }
                                                                if (track.kind === "audio") {
                                                                        stream = new MediaStream();
                                                                        stream.addTrack(track.clone());
                                                                        remoteTracks[mid] = stream;
                                                                        $("#videoright").append(
                                                                                '<audio className="hide" id="peervideo' +
                                                                                mid +
                                                                                '" autoplay playsinline />'
                                                                        );
                                                                        Janus.attachMediaStream($("#peervideo" + mid).get(0), stream);
                                                                        if (remoteVideos === 0) {
                                                                                if ($("#videoright .no-video-container").length === 0) {
                                                                                }
                                                                        }
                                                                } else {
                                                                        remoteVideos++;
                                                                        $("#videoright .no-video-container").remove();
                                                                        stream = new MediaStream();
                                                                        stream.addTrack(track.clone());
                                                                        remoteTracks[mid] = stream;
                                                                        console.log("Created remote video stream:", stream);
                                                                        $("#videoright").append(
                                                                                '<video className="rounded centered peervideo" id="peervideo' +
                                                                                mid +
                                                                                '" width="100%" height="100%" autoplay playsinline muted="true" />'
                                                                        );
                                                                        Janus.attachMediaStream($("#peervideo" + mid).get(0), stream);
                                                                }
                                                                if (!addButtons) return;
                                                                $("#bitrate a")
                                                                        .removeAttr("disabled")
                                                                        .click(function () {
                                                                                //@ts-ignore
                                                                                var id = $(this).attr("id");
                                                                                var bitrate = parseInt(id) * 1000;
                                                                                if (bitrate === 0) {
                                                                                        console.log("Not limiting bandwidth via REMB");
                                                                                } else {
                                                                                        console.log(
                                                                                                "Capping bandwidth to " + bitrate + " via REMB"
                                                                                        );
                                                                                }
                                                                                $("#bitrateset")
                                                                                        //@ts-ignore
                                                                                        .html($(this).html() + '<span className="caret"></span>')
                                                                                        .parent()
                                                                                        .removeClass("open");
                                                                                videocall.send({
                                                                                        message: { request: "set", bitrate: bitrate },
                                                                                });
                                                                                return false;
                                                                        });
                                                        },
                                                        ondataopen: function () {
                                                                $("#videos").removeClass("hide").show();
                                                                $("#datasend").removeAttr("disabled");
                                                        },
                                                        ondata: function (data: any) {
                                                                console.debug("We got data from the DataChannel!", data);
                                                                $("#datarecv").val(data);
                                                        },
                                                        oncleanup: function () {
                                                                $("#videoright").empty();
                                                                $("#videos").hide();
                                                                if (bitrateTimer) clearInterval(bitrateTimer);
                                                                bitrateTimer = null;
                                                                $("#videos").hide();
                                                                simulcastStarted = false;
                                                                $("#simulcast").remove();
                                                                localTracks = {};
                                                                localVideos = 0;
                                                                remoteTracks = {};
                                                                remoteVideos = 0;
                                                        },
                                                });
                                        },
                                        error: function (error: any) {
                                                console.log("---init error session videocall--- ", error)
                                                console.error(error);
                                        },
                                        destroyed: function () {
                                                console.log("---init destroy session videocall--- ")
                                                // window.location.reload()
                                        }
                                });
                        },
                })
        }, [])

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
                console.log(" ---is_speaker--- ", is_speaker)
                console.log(" ---videocall--- ", videocall)
                if (videocall !== null) {
                        videocall?.send({
                                message: {
                                        request: "register",
                                        username: `${is_speaker ? 'speaker' : 'student'}-${user?.profile?.profile_id}`,
                                }
                        })
                        setREGISTER(true)
                }
        }

        function doHangup() {
                console.log('__record__  do_hangup: ', uuid_conf)
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
                        />
                </CreateJanusContext.Provider>
        )
}

// function getQueryStringValue(name: string) {
//         name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
//         let regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
//         let results = regex.exec(window !== undefined ? window?.location?.search : '');
//         return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
// }

function escapeXmlTags(value: any) {
        return value
}