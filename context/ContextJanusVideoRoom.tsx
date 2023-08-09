import { type FC, type ReactNode, type DispatchWithoutAction, type Dispatch, type SetStateAction, createContext, useEffect, useState, useMemo, useRef } from "react"
import { useRouter } from "next/router"
const { v4: uuidv4 } = require('uuid')

import { message, Modal } from "antd"

import type { ICallData } from 'types/call'

import { Janus } from 'scripts/janus'
import { useUser } from "store/use-user"
import { useWeb } from "./WebSocketContext"
import { axiosInstance } from "api/api-general"
import { updateStatus } from "api/api-status"
import { ModalCallingJanus } from "components/Janus"

interface IJanus {
  visible: boolean
  videocall: any
  propsCall: ICallData | null
  setPropsCall: Dispatch<SetStateAction<ICallData | null>>
}

type TProps = FC<{ children: ReactNode }>

export const CreateJanusContext = createContext<IJanus | null>(null)

var bitrateTimer: any = null
var simulcastStarted = false
var videocall: any = null
var janus: any = null
var jsep: any
var trackId: any = null
var tracks: any = null
var info_id_profile: any = null
var speaker_id: any = null
var profile_id: any = null
var uuid_conf: any = null
var doSimulcast = false
var janus = null
var sfutest: any = null
var stream: any
var myroom = 1234;	// Demo room
if (getQueryStringValue("room") !== "")
  myroom = parseInt(getQueryStringValue("room"));
var myusername: any = null
var myid = null
var mystream: any = null
var mypvtid: any = null
var localTracks: any = {}, localVideos = 0
var feeds: any[] = [], feedStreams: any = {}
var bitrateTimer: any
var doSimulcast = (getQueryStringValue("simulcast") === "yes" || getQueryStringValue("simulcast") === "true")
var doSvc = getQueryStringValue("svc")
if (doSvc === "") { doSvc = "" }
var acodec = (getQueryStringValue("acodec") !== "" ? getQueryStringValue("acodec") : null)
var vcodec = (getQueryStringValue("vcodec") !== "" ? getQueryStringValue("vcodec") : null)
var doDtx = (getQueryStringValue("dtx") === "yes" || getQueryStringValue("dtx") === "true")
var subscriber_mode = (getQueryStringValue("subscriber-mode") === "yes" || getQueryStringValue("subscriber-mode") === "true")
var use_msid = (getQueryStringValue("msid") === "yes" || getQueryStringValue("msid") === "true")

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

export const ContextJanusVideoRoom: TProps = ({ children }) => {
  const route = useRouter()
  const [propsCall, setPropsCall] = useState<ICallData | null>(null)
  const [visible, setVisible] = useState<boolean>(false)
  const { user, is_speaker, loading } = useUser() ?? {}
  const refVideoLeft = useRef<HTMLDivElement>()
  const refVideoRight = useRef<HTMLDivElement>()

  useEffect(() => {
    if (propsCall) {
      info_id_profile = propsCall?.user_info?.profile_id
      speaker_id = propsCall?.speaker_info?.profile_id
      profile_id = propsCall?.user_info?.profile_id
      uuid_conf = propsCall?.call_info?.uuid
    }
  }, [propsCall])
  const uuid = useMemo(() => uuidv4(), [])
  let close: boolean = false
  let isTimer: boolean = false
  const context = useWeb()
  const wsChannel = context?.wsChannel

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
      callback() {
        janus = new Janus({
          server: process.env.NEXT_PUBLIC_URL_WEBSOCKET_JANUS,
          async success() {
            janus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: uuid,
              success(pluginHandle: any) {
                videocall = pluginHandle
                sfutest = pluginHandle
              },
            })
          },
          error(error: any) { console.error(`---error init janus---`, error) },
          destroyed() { console.log("---init destroy session videocall--- ") },
        })
      }
    })
  }, [])

  return (
    <CreateJanusContext.Provider
      value={{
        visible: visible,
        videocall: videocall,
        propsCall: propsCall,
        setPropsCall: setPropsCall,
      }}
    >
      {children}
    </CreateJanusContext.Provider>
  )
}




function getQueryStringValue(name: string) {
  return name
}