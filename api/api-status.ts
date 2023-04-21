import { TStatus } from "types/store/user"
import { axiosInstance } from "./api-general"

export const updateStatus = async (status: TStatus): Promise<any> => axiosInstance.put(`/profile/update-online-status/`, { data: { status: status } }).then(response => response?.data).catch(e => { console.error("ERROR UPDATE: ", e) })