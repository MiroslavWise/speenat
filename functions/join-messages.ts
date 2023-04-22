import { IMessages } from "types/chat"

export interface IReturnMessages {
        messages: {
                text: string
                key: string
                time: string
                // file: IFile[]
        }[]
        name: string
        photo: string
        uuid: string | number
        id: string
}

function joinMessages(item_messages: IMessages[]): IReturnMessages[] {
        const items = [] as IReturnMessages[] 

        if (item_messages) {
                item_messages.forEach((message, index) => {
                        if (items.at(-1)?.uuid === message.from_user?.id) { 
                                items.at(-1)?.messages?.push({
                                        text: message?.text || '',
                                        key: message?.uuid,
                                        time: message?.created_at || '',
                                        // file: message?.files
                                })
                        } else {
                                items.push({
                                        name: message?.from_user?.full_name || '',
                                        uuid: message?.from_user?.id || '',
                                        photo: message?.from_user?.photo_url || '',
                                        id: `${message?.uuid}_time`,
                                        messages: [{
                                                text: message?.text || '',
                                                key: message?.uuid,
                                                time: message?.created_at || '',
                                                // file: message?.files
                                        }]
                                })
                        }
                })
        }

        return items
}

export { joinMessages }