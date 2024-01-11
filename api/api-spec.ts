import { axiosInstance } from "./api-general"
import type { IDataReplaceSpec, ISpecList, ISpecializationsAll } from "types/spec"

export const speakerSpecAdd = async (value: IDataReplaceSpec): Promise<ISpecList> =>
    axiosInstance.post(`/speaker/spec/add/`, value)
export const speakerSpecEdit = async (id: any, value: IDataReplaceSpec): Promise<ISpecList> =>
    axiosInstance
        .post(`/speaker/spec/${id}/edit/`, value)
        .then((response) => response.data)
        .catch((e) => {
            console.error("speakerSpecEdit DATA: ", e)
        })
export const speakerSpecAttachment = async (value: any): Promise<any> =>
    axiosInstance
        .post(`/speaker/spec/attachment/`, value)
        .then((response) => response.data)
        .catch((e) => {
            console.error("speakerSpecAttachment DATA: ", e)
        })
export const speakerSpecAttachmentDelete = async (id: any): Promise<any> =>
    axiosInstance
        .delete(`/speaker/spec/attachment/`, { data: { attachment_id: id } })
        .then((response) => response.data)
        .catch((e) => {
            console.error("speakerSpecAttachmentDelete DATA: ", e)
        })

export const specializationsAllList = async (): Promise<ISpecializationsAll[]> =>
    axiosInstance
        .get(`/specialization/`)
        .then((response) => response.data)
        .catch((e) => {
            console.error("USER DATA: ", e)
        })
