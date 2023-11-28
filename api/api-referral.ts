import { axiosInstance } from "./api-general"

export const apiReferralPrice = (): Promise<{ data: IResponseReferralPrice & IResponseReferralPriceMessage }> =>
    axiosInstance.get(`/referral-price`)

export const apiPostReferralLinkBuy = (): Promise<{ data: IResponseReferralPrice }> =>
    axiosInstance.post(`/referral-link-buy`, {})

interface IResponseReferralPrice {
    id: string
    profile?: number
    amount: string
    created_at: Date
    updated_at: Date
}

type TMessageReferral = "Реферальная ссылка уже активна!" | "Недостаточно средств на счёту!" | "No referral price found"

interface IResponseReferralPriceMessage {
    message: TMessageReferral
}
