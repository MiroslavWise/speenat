import { TStatus } from "./store/user"

export interface ISpecList{
        id: number
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
                specialization: string
                consult_issues: string
        }
        specialization_id: number
        university: string
        scientific_degree: boolean
        scientific_degree_text: string
        attachments: {
                id: number
                name: string
                file: string
        }[]
        work_experience: number
        category: string
        get_category_display: string
        consultation_time: {
                id: number
                sessions_time: string
                original_price: string
                price: string
        }[]
        rating: number
}

export interface IDataReplaceSpec {
        university: string
        scientific_degree: boolean
        scientific_degree_text: string
        work_experience: number
        category: string
}