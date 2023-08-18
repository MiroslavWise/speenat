export interface IIncomingCallFromUserProps{
        incomeUserData: {
                call_info?: {
                        conf_id?: number | string,
                        sessions_time?: string,
                        specialization?: string, 
                        uuid?: string,
                },
                speaker_profile_id?: number,
                speaker_id?: number | string,
                user_info?:{
                        full_name: string,
                        profile_id?: number | string,
                        avatar_url?: string | null
                },
                speaker_info?: {
                        profile_id?: number | string,
                        full_name?: string,
                        avatar_url?: string | null,
                        speaker_id?: number | string
                }
        }
        speakerAnswerCall: (answer: boolean, profile_id: number | string ) => void
}

export interface ICallData{
        speaker_id: number
        speaker_profile_id: number
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
        speaker_info?: {
                profile_id: number,
                full_name: string,
                avatar_url: string,
                speaker_id: number
        },
}
