import { Dispatch, DispatchWithoutAction } from "react"




export type TGender = "male" | "female" | null
export type TStatus = "online" | "offline" | "busy"
export type TStatusCall = "CALL_END" | "COMPLETED_AHEAD"
export interface IUser{
        profile: {
                address: string
                balance: {
                        current_balance: string
                        currency: {
                                id: number
                                name: string
                        }
                }
                balance_referral_sum: string
                birthday: string
                currency: {
                        id: number
                        name: string
                }
                gender: TGender
                gender_display: string
                is_accountant: string
                is_can_use_ref_code: boolean
                phone: string
                photo: string
                profile_id: number
                referral_code: string
                status: TStatus
                user: {
                        id: number
                        email: string
                        full_name: string
                        middle_name: string
                        email_verified: boolean
                        telegramuser: {
                                is_mailing_recipient: true
                                need_verification: true
                                username: string
                        } | null
                        is_speaker: boolean
                        is_superuser: boolean
                        is_admin: boolean
                        is_staff: boolean
                        is_active: boolean
                        date_joined: string
                }
        }
        user: {
                id: number
                email: string
                full_name: string
                middle_name: string
                email_verified: boolean
                telegramuser: {
                        is_mailing_recipient: true
                        need_verification: true
                        username: string
                } | null
                is_speaker: boolean
                is_superuser: boolean
                is_admin: boolean
                is_staff: boolean
                is_active: boolean
                date_joined: string
        }
}

export interface IUserStore{
        user: undefined | IUser
        loading: boolean
        is_speaker: boolean
        is_superuser: boolean
        is_admin: boolean
        is_staff: boolean
        is_active: boolean

        getUserData: Dispatch<boolean> | DispatchWithoutAction
        getReset: DispatchWithoutAction
}

export interface IUserCurrent{
        id: number
        full_name: string
        avatar_url: string
        user: {
                id: number
                full_name: string
                email_verified: boolean
        }
}

export interface ISpec{
        "id": number
        "profile": {
                "id": number
                "full_name": string
                "avatar_url": string
                "status": TStatus
                "verified": boolean
        },
        "specialization": {
                "id": number
                "name": string
                "description": string
                "consult_issues": string
        },
        "specialization_id": number
        "university": string
        "scientific_degree": boolean
        "scientific_degree_text": string
        "attachments": {
                "id": number
                "name": string
                "file": string
        }[]
        "work_experience": number
        "category": string
        "get_category_display": string
        "consultation_time": {
                "id": number
                "sessions_time": TSession
                "original_price": string
                "price": string
        }[]
        "rating": number
}

export interface ISpeakerData{
        "profile": {
                "user": number
                "profile_id": number
                "photo_url": string
                "status": TStatus
                "specialization": ISpecItems[]
                full_name: string
        },
        "additional_info": string
        "additional_info_files": string
        "verified": boolean
        "service_issues": string
        "get_all_specialization": ISpec[]
        "accepts_at_current_time": {
                "id": number
                "full_name": string
                "avatar_url": string
                "user": {
                        "id": number
                        "full_name": string
                        "email_verified": boolean
                }
        }
}

export interface IFeedback{
        count: number
        next: string
        previous: string
        results: {
                id: number
                speaker: number
                author: {
                        full_name: string
                        avatar_url: string
                }
                rating: number
                text: string
                created_at: string
        }[]
}

export interface IArchive{
        count: number
        next: string
        previous: string
        results: {
                conference_currency: {
                        id: number
                        name: string
                }
                conference_time: {
                        id: number
                        price: string
                        sessions_time: TSession
                }
                created_at: string
                id: number
                price_service: string
                price_speaker: string
                record_url: "not_found" | string
                speaker: {
                        accepts_at_current_time: any
                        id: number
                        profile: {
                                email: string
                                full_name: string
                                id: number
                                photo_url: string
                        }
                }
                speaker_id: number
                status: TStatusCall
                student_profile: {
                        email: string
                        full_name: string
                        id: number
                        photo_url: string
                }
                uuid: string
        }[]
}

export interface ISpecItems{
        "id": number
        "profile": {
                "id": number
                "full_name": string
                "avatar_url": string
                "status": TStatus
                "verified": boolean
        },
        "specialization": {
                "id": number
                "name": string
                "description": string
                "consult_issues": string
        },
        "specialization_id": number
        "university": string
        "scientific_degree": boolean
        "scientific_degree_text": string
        "attachments": {
                "id": number
                "name": string
                "file": string | null
        }[]
        "work_experience": number
        "category": string
        "get_category_display": string
        "consultation_time": {
                "id": number
                "sessions_time": TSession
                "original_price": number | string
                "price": number | string
        }[]
        "rating": number
        additional_info: string
        region_living: string
}


export interface IDataSpecEdit{
        
}

type TSession = "60min" | "5min" | "20min"