import axios from "axios"

export const URL = `${process.env.NEXT_PUBLIC_URL}/v1`
export const URL_SOCKET = (token: string) => `${process.env.NEXT_PUBLIC_URL_WEBSOCKET}/?token=${token}`

export const axiosInstance = axios.create({
    baseURL: URL,
    withCredentials: true,
})

axiosInstance.interceptors.request.use((config: any) => {
    const newConfig = { ...config }

    const Authorization = JSON.parse(localStorage.getItem("auth")!).state.token
        ? {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem("auth")!).state.token}`,
          }
        : {}

    newConfig.headers = {
        ...Authorization,
    }

    return newConfig
})
