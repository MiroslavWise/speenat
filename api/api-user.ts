import { axiosInstance } from "./api-general"
import type{ ISpeakerData, IUser, IUserCurrent } from "types/store/user"
import type { IDataProfile, IFilterProfiles } from "types/store/profiles"

export const  profileMy = async (): Promise<IUser> => {

        return axiosInstance.get('/profile/').then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const profileId = async (id: any): Promise<IUserCurrent> => {

        return axiosInstance.get(`/profile/${id}`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const speakers = async ({ page, verified, spec_rating, price_gte, price_lte, speaker__status }: IFilterProfiles): Promise<IDataProfile> => {

        return axiosInstance.get(`/speaker-filter/?page=${page}${verified ? `&verified=${verified}` : ""}${spec_rating ? `&spec_rating=${spec_rating}` : ""}&price_gte=${price_gte}&price_lte=${price_lte}${speaker__status ? `&speaker__status=${speaker__status}`: ""}`)
                .then(response => response.data)
                .catch(e => { console.error("USER DATA: ", e) })
}

export const speakerId = async (id: any): Promise<ISpeakerData> => {

        return axiosInstance.get(`/speaker/${id}`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}