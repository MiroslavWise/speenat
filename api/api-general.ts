import axios from "axios"
import userData from "helpers/user-data"

export const URL = `${process.env.NEXT_PUBLIC_URL}/v1`
export const URL_SOCKET = (token: string) => `${process.env.NEXT_PUBLIC_URL_WEBSOCKET}/?token=${token}`

export const axiosInstance = axios.create({
        baseURL: URL,
        withCredentials: true
})

axiosInstance.interceptors.request.use((config: any) => {
        const newConfig = { ...config }

        const Authorization = userData.JWT ? { 'Authorization': `Bearer ${userData.JWT}` } : {}

        newConfig.headers = {
                ...Authorization,
        }

        return newConfig
})