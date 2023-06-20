export interface IIncomingCallFromUserProps{
        incomeUserData: {
                call_info?: {
                        conf_id?: number | string,
                        sessions_time?: string,
                        specialization?: string, 
                        uuid?: string,
                },
                doctor_profile_id?: number,
                doctor_id?: number | string,
                user_info?:{
                        full_name: string,
                        profile_id?: number | string,
                        avatar_url?: string | null
                },
                doctor_info?: {
                        profile_id?: number | string,
                        full_name?: string,
                        avatar_url?: string | null,
                        doctor_id?: number | string
                }
        }
        doctorAnswerCall: (answer: boolean, profile_id: number | string ) => void
}

export interface ICallData{
        doctor_id: number
        doctor_profile_id: number
        type: string
        call_info: {
                chat_uuid: string
                conf_id: number
                sessions_time: string
                specialization: string
                uuid: string
        }
        user_info: {
                avatar_url: string
                full_name: string
                profile_id: number
        }
        doctor_info?: {
                profile_id?: number | string,
                full_name?: string,
                avatar_url?: string | null,
                doctor_id?: number | string
        },
        
}
