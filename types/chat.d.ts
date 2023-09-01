interface IUserChatMessage {
    email: string
    full_name: string
    id: number
    photo_url: string
}

export interface IMessages {
    created_at: string
    from_user: IUserChatMessage
    id: string
    is_read: boolean
    replying_to: any
    text: string
    to_user: IUserChatMessage
    updated_at: string
    uuid: string
}

export interface IChatsDataAll {
    created_at: string
    messages: IMessages[]
    speaker: IUserChatMessage
    student: IUserChatMessage
    updated_at: string
    uuid: string
}

export interface IMessagesInChat {
    count: number
    next: string
    previous: string
    results: IMessages[]
}
