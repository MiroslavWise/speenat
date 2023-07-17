import { TGender } from "types/store/user"
import { axiosInstance } from "./api-general"
import moment from "moment"



export const updateUser = async ({ name }: { name: string }): Promise<any> => {
        
        return axiosInstance.put(`/profile/update-user/`, {
                full_name: name
        })
                .then(response => response?.data)
                .catch(e => {
                        console.error("ERROR UPDATE: ", e)
                })
}

export interface IValueDataUser{
        phone: string
        address: string
        birthday: any
        gender:TGender | null
}

export const updateDataUser = async (value: IValueDataUser): Promise<any> => {

        return axiosInstance.put(`/profile/update-info/`, {
                phone: value.phone,
                address: value.address,
                birthday: value.birthday ? moment(value?.birthday?.$d).format("YYYY-MM-DD") : null,
                gender: value.gender,
        })
                .then(response => response?.data)
                .catch(e => {
                        console.error("ERROR UPDATE: ", e)
                })
}

export const updatePhotoUser = async (data: any): Promise<any> => {

        return axiosInstance.post(`/profile/update-photo/`, data)
                .then(response => {
                        console.log("response data photo: ", response)
                        return response?.data
                })
                .catch(e => {
                        console.error("ERROR UPDATE: ", e)
                })
}