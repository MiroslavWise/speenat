import { type FC, type ReactNode, type DispatchWithoutAction, type Dispatch, type SetStateAction, createContext, useEffect, useState, useMemo, useRef } from "react"
import { useRouter } from "next/router"
const { v4: uuidv4 } = require('uuid')
import { shallow } from "zustand/shallow"

import { Janus } from 'scripts/janus'
import { useUser } from "store/use-user"
import { useWeb } from "./WebSocketContext"
import { axiosInstance } from "api/api-general"
import { updateStatus } from "api/api-status"
import { ModalCallingJanus } from "components/Janus"
import { useCallJanus, usePropsCallingJanus } from "store/use-call-janus"
import { apiToConfInfo } from "api/api-review"

interface IJanus {
  visible: boolean
  videocall: any
  createRoom: (value: number) => Promise<any>
  joinAndVisible: Dispatch<number>
  publishOwnFeed: (value: boolean) => void
}

type TProps = FC<{ children: ReactNode }>

export const CreateJanusContext = createContext<IJanus | null>(null)

var videocall: any = null
var janus: any = null
var jsep: any
var trackId: any = null
var tracks: any = null
var speaker_id: any = null
var student_id: any = null
var uuid_conf: any = null
var doSimulcast = false
var janus = null
var sfutest: any = null
var stream: any
var myusername: any = null
var myid: any = null
var mystream: any = null
var myRoomId: any = null
var mypvtid: any = null
var localTracks: any = {}, localVideos = 0
var feeds: any[] = [], feedStreams: any = {}
var doSimulcast = getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true"

var acodec = getQueryStringValue("acodec") !== "" ? getQueryStringValue("acodec") : null
var vcodec = getQueryStringValue("vcodec") !== "" ? getQueryStringValue("vcodec") : null
var doDtx = getQueryStringValue("dtx") === "yes" || getQueryStringValue("dtx") === "true"
var subscriber_mode = getQueryStringValue("subscriber-mode") === "yes" || getQueryStringValue("subscriber-mode") === "true"
var use_msid = getQueryStringValue("msid") === "yes" || getQueryStringValue("msid") === "true"
var remoteFeed: any

interface IValuesResponseConfInfo {
  status: "CALL_ONLINE"
  id: number
  uuid: number
}

export const ContextJanusVideoRoom: TProps = ({ children }) => {
  const { push } = useRouter()
  const { wsChannel } = useWeb() ?? {}
  const [visible, setVisible] = useState<boolean>(false)
  const [isJanus, setIsJanus] = useState(false)
  const { user, is_speaker } = useUser() ?? {}
  const refVideoLeft = useRef<HTMLDivElement>()
  const refVideoRight = useRef<HTMLDivElement>()
  const [doSvc, setDoSvc] = useState("")
  const { deleteTime, setTime } = useCallJanus(state => ({
    setTime: state.setTime,
    deleteTime: state.deleteTime,
  }), shallow)
  const {
    call_info,
    speaker_info,
    user_info,
    setCallInfo,
    setSpeakerInfo,
    setUserInfo,
    idRoomState,
    setIdRoom,
    setUuidRoom,
    uuidRoom,
    deleteAll,
  } = usePropsCallingJanus(state => ({
    call_info: state.call_info,
    speaker_info: state.speaker_info,
    user_info: state.user_info,
    setCallInfo: state.setCallInfo,
    setSpeakerInfo: state.setSpeakerInfo,
    uuidRoom: state.uuidRoom,
    setUserInfo: state.setUserInfo,
    idRoomState: state.idRoom,
    setIdRoom: state.setIdRoom,
    setUuidRoom: state.setUuidRoom,
    deleteAll: state.deleteAll,
  }), shallow)

  useEffect(() => { setDoSvc(getQueryStringValue("svc")) }, [])
  useEffect(() => {
    setTimeout(() => {
      if (uuidRoom) {
        apiToConfInfo(uuidRoom)
          .then((response: IValuesResponseConfInfo) => {
            if (response?.status === "CALL_ONLINE") {
              joinInVideoRoom(response.id)
                .finally(() => {
                  requestAnimationFrame(() => {
                    publishOwnFeed(true)
                    setVisible(true)
                  })
                })
            }
          })
      } else {
        deleteAll()
      }
    }, 1500)
  }, [])

  useEffect(() => {
    if (call_info) {
      uuid_conf = call_info?.uuid
      myRoomId = Number(call_info?.conf_id)
    }
    if (speaker_info) {
      speaker_id = speaker_info?.speaker_id
    }
    if (user_info) {
      student_id = user_info?.profile_id
    }
  }, [call_info, speaker_info, user_info])

  const uuid = useMemo(() => uuidv4(), [])
  let close: boolean = false
  let isTimer: boolean = false

  useEffect(() => {
    if (user) {
      myusername = user?.profile?.profile_id
    }
    if (user && idRoomState && isJanus) {
      if (!myRoomId) {
        myRoomId = idRoomState
      }
    }
  }, [user, isJanus, idRoomState])

  useEffect(() => {
    const listenerCall = (event: any) => {
      const notification = JSON.parse(event.data).data
      if (notification?.type === "call_accept_ok") {
        setCallInfo(notification.call_info)
        setSpeakerInfo(notification.speaker_info)
        setUserInfo(notification.user_info)
        setUuidRoom(notification.call_info.uuid)
        setTime()
        if (!is_speaker) {
          joinAndVisible(notification.call_info.conf_id!)
        }
      }
      if (notification?.data?.type === "closing_videoroom") {
        setVisible(false)
        closeVideoCallTalk()
        unpublishOwnFeed()
        deleteTime()
        if (is_speaker) {
          updateStatus("online")
        }
        push(`/feedback`)
      }
    }
    if (wsChannel) {
      wsChannel?.addEventListener('message', listenerCall)
    }

    return () => wsChannel?.removeEventListener("message", listenerCall)
  }, [wsChannel, is_speaker])

  useEffect(() => {
    Janus.init({
      debug: false,
      callback: function () {
        janus = new Janus(
          {
            server: process.env.NEXT_PUBLIC_URL_WEBSOCKET_JANUS,
            success: async function () {
              janus.attach(
                {
                  plugin: "janus.plugin.videoroom",
                  opaqueId: uuid,
                  success: function (pluginHandle: any) {
                    console.log("---pluginHandle success--- ", pluginHandle)
                    sfutest = pluginHandle;
                    videocall = pluginHandle
                    setIsJanus(true)
                  },
                  error: function (error: any) {
                    console.info("---ERROR---", error)
                  },
                  consentDialog: function (on: any) {
                    if (on) {
                    } else {
                    }
                  },
                  iceState: function (state: any) {
                  },
                  mediaState: function (medium: any, on: any, mid: any) {
                    console.log("---medium---", medium, "---on---", on, "---mid---", mid)
                  },
                  webrtcState: function (on: any) {
                  },
                  slowLink: function (uplink: any, lost: any, mid: any) {
                  },
                  onmessage: function (msg: any, jsep: any) {
                    console.log("---onmessage msg--- ", msg)
                    let event = msg["videoroom"];
                    if (event) {
                      if (event === "joined") {
                        myid = msg["id"];
                        mypvtid = msg["private_id"];
                        if (msg["publishers"]) {
                          let list = msg["publishers"];
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
                            newRemoteFeed(id, display, streams, uuid, myRoomId);
                          }
                        }
                      } else if (event === "destroyed") {
                      } else if (event === "event") {
                        if (msg["streams"]) {
                          let streams = msg["streams"];
                          for (let i in streams) {
                            let stream = streams[i];
                            stream["id"] = myid
                            stream["display"] = `${is_speaker ? "speaker" : "student"}-${myusername}`
                          }
                          feedStreams[myid] = streams;
                        } else if (msg["publishers"]) {
                          let list = msg["publishers"];
                          for (let f in list) {
                            if (list[f]["dummy"])
                              continue;
                            let id = list[f]["id"];
                            let display = list[f]["display"];
                            let streams = list[f]["streams"];
                            for (let i in streams) {
                              let stream = streams[i];
                              stream["id"] = id;
                              stream["display"] = display;
                            }
                            feedStreams[id] = streams;
                            newRemoteFeed(id, display, streams, uuid, myRoomId)
                          }
                        } else if (msg["leaving"]) {
                          let leaving = msg["leaving"];
                          let remoteFeed = null;
                          for (let i = 1; i < 6; i++) {
                            if (feeds[i] && feeds[i].rfid == leaving) {
                              remoteFeed = feeds[i];
                              break;
                            }
                          }
                          if (remoteFeed) {
                            console.log("---remoteFeed---", remoteFeed)
                            //---------------------------------------------------------------
                            // $('#remote'+remoteFeed.rfindex).empty().hide();
                            // $('#videoremote'+remoteFeed.rfindex).empty();
                            //----------------
                            feeds[remoteFeed.rfindex] = null;
                            remoteFeed.detach();
                          }
                          delete feedStreams[leaving];
                        } else if (msg["unpublished"]) {
                          let unpublished = msg["unpublished"];
                          console.log("---unpublished---", unpublished)
                          if (unpublished === "ok") {
                            // sfutest.hangup()
                          }
                          let remoteFeed = null;
                          for (let i = 1; i < 6; i++) {
                            if (feeds[i] && feeds[i].rfid == unpublished) {
                              remoteFeed = feeds[i];
                              break;
                            }
                          }
                          if (remoteFeed) {
                            //------------------------------------------------------------------
                            // $('#remote'+remoteFeed.rfindex).empty().hide();
                            // $('#videoremote'+remoteFeed.rfindex).empty();
                            //------------------------------------------------------------------
                            feeds[remoteFeed.rfindex] = null;
                            remoteFeed.detach();
                          }
                          delete feedStreams[unpublished];
                        } else if (msg["error"]) {
                          console.info("---ERROR---", msg["error"])
                        }
                      }
                    }
                    if (jsep) {
                      console.log("--- Handling SDP as well jsep ---", jsep)
                      sfutest.handleRemoteJsep({ jsep: jsep });
                      let audio = msg["audio_codec"];
                      if (mystream && mystream.getAudioTracks() && mystream.getAudioTracks().length > 0 && !audio) {
                      }
                      let video = msg["video_codec"];
                      if (mystream && mystream.getVideoTracks() && mystream.getVideoTracks().length > 0 && !video) {

                      }
                    }
                  },
                  onlocaltrack: function (track: any, on: any) {
                    console.log("---onlocaltrack track--- ", track, "---onlocaltrack on---", on)
                    let trackId = track.id.replace(/[{}]/g, "");
                    if (!on) {
                      let stream = localTracks[trackId];
                      if (stream) {
                        try {
                          let tracks = stream.getTracks();
                          for (let i in tracks) {
                            let mst = tracks[i];
                            if (mst !== null && mst !== undefined)
                              mst.stop();
                          }
                        } catch (e) { }
                      }
                      if (track.kind === "video") {
                        if (refVideoLeft.current) {
                          refVideoLeft.current.getElementsByTagName("video")[0].style.display = "none"
                        }
                        localVideos--;
                        if (localVideos === 0) {
                        }
                      }
                      delete localTracks[trackId];
                      return;
                    }
                    let stream = localTracks[trackId];
                    if (stream) {
                      return;
                    }
                    if (track.kind === "audio") {
                      if (localVideos === 0) {
                      }
                    } else {
                      localVideos++
                      stream = new MediaStream([track])
                      localTracks[trackId] = stream
                      const newElementVideo = document.createElement("video")
                      newElementVideo.className = "rounded centered peervideo"
                      newElementVideo.id = `myvideo${trackId}`
                      newElementVideo.style.width = "100%"
                      newElementVideo.style.height = "100%"
                      newElementVideo.autoplay = true
                      newElementVideo.playsInline = true
                      newElementVideo.muted = true
                      refVideoLeft.current?.appendChild(newElementVideo)
                      Janus.attachMediaStream(document.getElementById(`myvideo${trackId}`), stream)
                    }
                  },
                  onremotetrack: function (track: any, mid: any, on: any) {
                    console.log("on remote track: ", track)
                  },
                  oncleanup: function () {
                    mystream = null
                    delete feedStreams[myid]
                    localTracks = {};
                    localVideos = 0;
                  }
                });
            },
            error: function (error: any) {
              console.log("error : ", error)
            },
            destroyed: function () {
              // window.location.reload();
            }
          });
      }
    });

    return () => janus?.destroy()
  }, [])

  const createRoom = async (idRoom: number) => {
    console.log("---createRoom---", idRoom)
    return await sfutest.send({
      message: {
        request: "create",
        room: idRoom,
      }
    })
  }
  const joinInVideoRoom = async (idRoom: number) => {
    console.log("---joinInVideoRoom---", idRoom, myusername)
    return await sfutest.send({
      message: {
        request: "join",
        ptype: "publisher",
        display: `${is_speaker ? "speaker" : "student"}-${myusername}`,
        room: idRoom,
      },
    })
  }

  function joinAndVisible(idRoom: number) {
    setIdRoom(idRoom)
    joinInVideoRoom(idRoom)
      .finally(() => {
        requestAnimationFrame(() => {
          publishOwnFeed(true)
          setVisible(true)
        })
      })
  }

  async function closeVideoCallTalk() {
    return await axiosInstance.post(
      `/conference/done/`,
      {
        conf_uuid: uuidRoom,
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

  function publishOwnFeed(useAudio: boolean) {
    console.log("---publishOwnFeed--- ")
    let tracks = []
    tracks.push({
      type: 'audio',
      capture: true,
      recv: false,
    })
    tracks.push({
      type: 'video',
      capture: true,
      recv: false,
      simulcast: doSimulcast,
      svc: ((vcodec === 'vp9' || vcodec === 'av1') && doSvc) ? doSvc : null
    })

    console.log("---publishOwnFeed tracks--- ", tracks)
    sfutest.createOffer({
      tracks: tracks,
      customizeSdp(jsep: any) {
        if (doDtx) {
          jsep.sdp = jsep.sdp.replace("useinbandfec=1", "useinbandfec=1;usedtx=1")
        }
      },
      success(jsep: any) {
        let publish: any = {
          request: "configure",
          audio: useAudio,
          video: true,
          room: Number(call_info?.conf_id!),
          record: true,
          filename: `/opt/janus/share/janus/recordings/${is_speaker ? speaker_id : student_id}-${uuid_conf}`,
        }
        if (acodec) {
          publish["audiocodec"] = acodec
        }
        if (vcodec) {
          publish["videocodec"] = vcodec
        }
        sfutest.send({ message: publish, jsep: jsep })
      },
      error(error: any) {
        console.log("---publishOwnFeed error track --- ", error)
      }
    })
  }

  function unpublishOwnFeed() {
    let unpublish = { request: "unpublish" }
    sfutest.send({ message: unpublish })
  }

  function doHangup() {
    wsChannel?.send(JSON.stringify({
      data: {
        type: "closing_videoroom",
        id_room: myRoomId,
        id_interviewee: !is_speaker ? speaker_id : student_id,
        student_id: student_id,
        speaker_id: speaker_id,
      }
    }))
  }

  function newRemoteFeed(id: any, display: any, streams: any, opaqueId: any, idRoom: number) {
    console.log("---newRemoteFeed--- ", id, display, streams, idRoom)
    let remoteFeed: any = null
    if (!streams)
      streams = feedStreams[id];
    janus.attach(
      {
        plugin: "janus.plugin.videoroom",
        opaqueId: opaqueId,
        success: function (pluginHandle: any) {
          remoteFeed = pluginHandle
          remoteFeed.remoteTracks = {}
          remoteFeed.remoteVideos = 0
          remoteFeed.simulcastStarted = false
          remoteFeed.svcStarted = false
          console.log("---remoteFeed---", remoteFeed)
          let subscription = [];
          console.log("---remoteFeed streams---", streams)
          for (let i in streams) {
            let stream = streams[i];
            subscription.push({
              feed: stream.id,
              mid: stream.mid,
            });
            remoteFeed.rfid = stream.id
            remoteFeed.rfdisplay = escapeXmlTags(stream.display)
          }
          console.log("---remoteFeed subscribe idRoom---", idRoom)
          let subscribe = {
            request: "join",
            room: idRoom,
            ptype: "subscriber",
            streams: subscription,
            use_msid: use_msid,
          };
          remoteFeed.send({ message: subscribe });
        },
        error: function (error: any) {
          console.log("---ERROR newRemoteFeed---", error)
        },
        iceState: function (state: any) {
          console.log("---state---", state)
        },
        webrtcState: function (on: any) {
          console.log("---webrtcState---", on)
        },
        slowLink: function (uplink: any, lost: any, mid: any) {
          console.log("---slowLink---", uplink, lost, mid)
        },
        onmessage: function (msg: any, jsep: any) {
          console.log("---newRemoteFeed onmessage msg---", msg)
          let event = msg["videoroom"];
          if (msg["error"]) {
          } else if (event) {
            if (event === "attached") {
              for (let i = 1; i < 6; i++) {
                if (!feeds[i]) {
                  feeds[i] = remoteFeed;
                  remoteFeed.rfindex = i;
                  break;
                }
              }
              if (!remoteFeed.spinner) {
                let target = document.getElementById('videoremote' + remoteFeed.rfindex);
              } else {
                remoteFeed.spinner.spin();
              }
              console.log("---remoteFeed.rfindex---", remoteFeed.rfindex)
              //------------------------------------------------------------------------------------------------------
              // $('#remote' + remoteFeed.rfindex).removeClass('hide').html(remoteFeed.rfdisplay).show();
              //------------------------------------------------------------------------------------------------------
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
                  let body = { request: "start", room: idRoom };
                  remoteFeed.send({ message: body, jsep: jsep });
                },
                error: function (error: any) {
                  console.log("---ERRROR error---", error)
                }
              });
          }
        },
        onlocaltrack: function (track: any, on: any) {
        },
        onremotetrack: function (track: any, mid: any, on: any, metadata: any) {
          console.log("---newRemoteFeed onremotetrack---", track)
          if (!on) {
            if (track.kind === "video") {
              remoteFeed.remoteVideos--;
              if (remoteFeed.remoteVideos === 0) {
              }
            }
            delete remoteFeed.remoteTracks[mid];
            return;
          }
          // If we're here, a new track was added
          if (remoteFeed.spinner) {
            remoteFeed.spinner.stop();
            remoteFeed.spinner = null;
          }
          if (track.kind === "audio") {
            let stream = new MediaStream([track]);
            remoteFeed.remoteTracks[mid] = stream;
            console.log("---Created remote audio stream:---", stream)
            const newAudioElement = document.createElement("audio")
            newAudioElement.className = "hide"
            newAudioElement.id = `remotevideo${remoteFeed.rfindex}-${mid}`
            newAudioElement.autoplay = true
            refVideoRight.current?.appendChild(newAudioElement)
            Janus.attachMediaStream(document.getElementById(`remotevideo${remoteFeed.rfindex}-${mid}`), stream)
            if (remoteFeed.remoteVideos === 0) {

            }
          } else {
            remoteFeed.remoteVideos++
            let stream = new MediaStream([track]);
            remoteFeed.remoteTracks[mid] = stream;
            console.log("---Created remote video stream:---", stream)
            const newElementVideo = document.createElement("video")
            newElementVideo.className = "rounded centered peervideo"
            newElementVideo.id = `remotevideo${remoteFeed.rfindex}-${mid}`
            newElementVideo.style.width = "100%"
            newElementVideo.style.height = "100%"
            newElementVideo.autoplay = true
            newElementVideo.playsInline = true
            newElementVideo.muted = true
            refVideoRight.current?.appendChild(newElementVideo)
            Janus.attachMediaStream(document.getElementById(`remotevideo${remoteFeed.rfindex}-${mid}`), stream)
          }
        },
        oncleanup: function () {
          if (remoteFeed.spinner)
            remoteFeed.spinner.stop();
          remoteFeed.spinner = null;
          remoteFeed.simulcastStarted = false;
          remoteFeed.remoteTracks = {};
          remoteFeed.remoteVideos = 0;
        }
      });
  }

  return (
    <CreateJanusContext.Provider
      value={{
        visible: visible,
        videocall: videocall,
        createRoom: createRoom,
        joinAndVisible: joinAndVisible,
        publishOwnFeed: publishOwnFeed,
      }}
    >
      {children}
      <ModalCallingJanus
        visible={visible}
        videocall={videocall}
        doHangup={doHangup}
        //@ts-ignore
        refVideoLeft={refVideoLeft!}
        //@ts-ignore
        refVideoRight={refVideoRight!}
      />
    </CreateJanusContext.Provider>
  )
}

function getQueryStringValue(name: string) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  if (typeof window === "undefined") {
    return name
  }
  let regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(window.location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function escapeXmlTags(value: string) {
  if (value) {
    let escapedValue = value.replace(new RegExp('<', 'g'), '&lt');
    escapedValue = escapedValue.replace(new RegExp('>', 'g'), '&gt');
    return escapedValue;
  }
}