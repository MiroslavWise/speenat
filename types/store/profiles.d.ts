import { Dispatch, DispatchWithoutAction } from "react"
import { TStatus } from "./user"



export interface IProfile {
        id: number
        speaker_id: string
        profile: {
                id: number
                full_name: string
                avatar_url: string
                status: TStatus
                verified: boolean
        }
        specialization: {
                id: number
                name: string
                description: string
                consult_issues: string
        },
        specialization_id: number
        spec_rating: string | number
        consultation_time:{
                id: number
                sessions_time: string
                price: string | number
        }[]
}

export interface IFilterProfiles{
        price_gte: number
        price_lte: number
        speaker__status: TStatus | ""
        spec_rating: number | ""
        verified: boolean | ""
        page: number
}

export interface IDataProfile{
        count: number
        next: string
        previous: string
        results: IProfile[]
}

export interface IUseProfiles{
        profiles: IProfile[]
        loading: boolean
        filters: IFilterProfiles
        total: number

        getProfiles: DispatchWithoutAction
        getReset: DispatchWithoutAction
        getFilter: Dispatch<IFilterProfiles>
}