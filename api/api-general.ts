import axios from "axios"
import userData from "helpers/user-data"

export const URL = `${process.env.NEXT_PUBLIC_URL}/v1`

export const axiosInstance = axios.create({
        baseURL: URL,
        withCredentials: true
})

axiosInstance.interceptors.request.use((config: any) => {
        const newConfig = { ...config }
        newConfig.headers = {
                'Authorization' : `Bearer ${userData.JWT}`
        }

        return newConfig
})