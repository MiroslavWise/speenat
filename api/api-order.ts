import { TGender, TStatus } from "types/store/user"
import { axiosInstance } from "./api-general"

export type TStatusAmount = "declined" | "fraud" | "rejected" | "error" | "validation" | "new" | "charged"

export const apiCreateOrder = async (data: IValue): Promise<{ data: IResponseCreateOrder }> =>
    axiosInstance.post(`/order/create`, data)

export const apiOrder = async (value: string): Promise<{ data: IResponseCreateOrder }> =>
    axiosInstance.get(`/order/${value}`)

export const apiOrderList = async (
    page: number,
): Promise<{
    data: {
        count: number
        results: IResponseCreateOrder[]
    }
}> => axiosInstance.get(`/order/order-list?page=${page}`)
interface IValue {
    amount: string | number
}

export interface IResponseCreateOrder {
    id: string
    order_number: number
    profile: {
        user: {
            id: number
            full_name: string
            email_verified: boolean
        }
        full_name: string
        gender: TGender
        photo_url: string // http://localhost:8006/media/profile/profile_default/default.png
        photo: string // http://localhost:8006/media/profile/profile_default/default.png
        address: any
        phone: any
        currency: number
        status: TStatus
        accept_politics: boolean
        accept_public_offer: boolean
    }
    amount: string
    comment: string
    payment_order_id: string
    payment_order_url: string // https://sandboxcheckout.paymtech.kz/pay/81700842289104082
    status: TStatusAmount
    created_at: Date
    updated_at: Date
}
