


interface IValues{
  isAdd: boolean
  idRoom?: string | null
  username?: string | null
}

interface IReturnValues{
  idRoom: any
  username: any
}

const prefix = "videoroom"
const keys = ["idRoom", "username"]

export function onAddVideoroomStorage({ isAdd, idRoom, username }: IValues) {
  if (typeof window === "undefined") {
    return
  }
  if (!isAdd) {
    keys.forEach(item => {
      window.sessionStorage.removeItem(`${prefix}.${item}`)
    })
    return
  }
  if (idRoom) {
    window.sessionStorage.setItem(`${prefix}.idRoom`, idRoom.toString())
  }
  if (username) {
    window.sessionStorage.setItem(`${prefix}.username`, username)
  }
}

export function isVideoroomStorage(): IReturnValues | undefined {
  if (typeof window === "undefined") {
    return
  }
  if (!window.sessionStorage.getItem(`${prefix}.idRoom`)) {
    return
  }
  if (!window.sessionStorage.getItem(`${prefix}.username`)) {
    return
  }
  return {
    "idRoom": window.sessionStorage.getItem(`${prefix}.idRoom`),
    "username": window.sessionStorage.getItem(`${prefix}.username`),
  }
}