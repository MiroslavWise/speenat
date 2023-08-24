import { type DispatchWithoutAction, type Dispatch } from "react"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import dayjs from "dayjs"

interface IUseCallJanus {
  time: undefined | number
  currentTime: undefined | number
  setTime: DispatchWithoutAction
  deleteTime: DispatchWithoutAction
  getTimerCurrent: DispatchWithoutAction
}

const OVERALL_TIME = 20 * 60

export const useCallJanus = create(
  persist<IUseCallJanus>(
    (set, get) => ({
      time: undefined,
      currentTime: undefined,

      setTime() {
        const time = dayjs().valueOf() / 1000
        set({ time: time })
      },
      getTimerCurrent() {
        if (get().time) {
          const REMAINING_TIME = get().time! + OVERALL_TIME - dayjs().valueOf() / 1000
          set({ currentTime: Number(REMAINING_TIME.toFixed(0)) })
        }
      },
      deleteTime() { set({ time: undefined, currentTime: undefined }) },
    }), {
    name: 'call-janus',
    storage: createJSONStorage(() => localStorage),
  }
  )
)

interface ICallInfo{
  conf_id: number
  sessions_time: string
  specialization: string
  uuid: string
}

interface ISpeakerInfo{
  avatar_url: string
  full_name: string
  profile_id: number
  speaker_id: number
}

interface IUserInfo{
  avatar_url: string
  full_name: string
  profile_id: number
}

interface IUsePropsCallingJanus{
  call_info: ICallInfo | undefined
  speaker_info: ISpeakerInfo | undefined
  user_info: IUserInfo | undefined
  idRoom: number | undefined
  uuidRoom: string | undefined
  
  setUuidRoom: Dispatch<string | undefined>
  setIdRoom: Dispatch<number | undefined>
  setCallInfo: Dispatch<ICallInfo | undefined>
  setSpeakerInfo: Dispatch<ISpeakerInfo | undefined>
  setUserInfo: Dispatch<IUserInfo | undefined>
  deleteAll: DispatchWithoutAction
}

export const usePropsCallingJanus = create(
  persist<IUsePropsCallingJanus>(
    (set, get) => ({
      call_info: undefined,
      speaker_info: undefined,
      user_info: undefined,
      idRoom: undefined,
      uuidRoom: undefined,

      setUuidRoom(value) {
        set({ uuidRoom: value }) 
      },
      setIdRoom(value) {
        set({ idRoom: value })
      },
      setCallInfo(value) {
        set({
          call_info: value,
          uuidRoom: value?.uuid,
        })
      },
      setSpeakerInfo(value) {
        set({
          speaker_info: value
        })
      },
      setUserInfo(value) {
        set({
          user_info: value
        })
      },
      deleteAll() {
        set({
          call_info: undefined,
          speaker_info: undefined,
          user_info: undefined,
          idRoom: undefined,
          uuidRoom: undefined,
        })
      },
    }), {
      name: 'janus-props',
      storage: createJSONStorage(() => localStorage),
    }
  )
)