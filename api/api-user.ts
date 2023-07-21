import { axiosInstance } from "./api-general"
import type{ IArchive, IFeedback, ISpeakerData, ISpec, ISpecItems, IUser, IUserCurrent, IDataSpecEdit } from "types/store/user"
import type { IDataProfile, IFilterProfiles } from "types/store/profiles"

export const  profileMy = async (): Promise<IUser> => {

        return axiosInstance.get('/profile/').then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const profileId = async (id: any): Promise<IUserCurrent> => {

        return axiosInstance.get(`/profile/${id}`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const speakers = async ({ page, verified, spec_rating, price_gte, price_lte, speaker__status }: IFilterProfiles): Promise<IDataProfile> => {

        return axiosInstance.get(`/speaker-filter/?page=${page}${verified ? `&verified=${verified}` : ""}${spec_rating ? `&spec_rating=${spec_rating}` : ""}&price_gte=${price_gte}&price_lte=${price_lte}${speaker__status ? `&speaker_status=${speaker__status}`: ""}`)
                .then(response => response.data)
                .catch(e => { console.error("USER DATA: ", e) })
}

export const speakerId = async (id: any): Promise<ISpeakerData> => {

        return axiosInstance.get(`/speaker/${id}`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const feedbackSpeakerId = async (id: any, page: number): Promise<IFeedback> => {

        return axiosInstance.get(`/speaker/${id}/feedback/?page=${page}`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const archives = async (page: number): Promise<IArchive> => {

        return axiosInstance.get(`/profile/conference-archive/?page=${page}`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const conference = async (id: any): Promise<any> => {

        return axiosInstance.get(`/conference/${id}`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}


export const specializations = async (): Promise<ISpecItems[]> => {

        return axiosInstance.get(`/speaker/spec/`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const specializationDelete = async (id: number): Promise<ISpecItems[]> => {

        return axiosInstance.delete(`/speaker/spec/${id}/delete/`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
}

export const usersAll = async (): Promise<{ count: number }> => axiosInstance.get(`/profiles/`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
export const conferenceAll = async (): Promise<{ count: number }> => axiosInstance.get(`/conferences/`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })
export const speakersAll = async (): Promise<{ count: number }> => axiosInstance.get(`/speaker-filter/`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })

export const companyAllOperations = async (): Promise<{ count: number }> => axiosInstance.get(`/company-operations/`).then(response => response.data).catch(e => { console.error("USER DATA: ", e) })