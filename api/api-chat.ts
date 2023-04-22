import { IChatsDataAll, IMessagesInChat } from "types/chat"
import { axiosInstance } from "./api-general"

export const chatsAll = async (): Promise<IChatsDataAll[]> => axiosInstance.get(`/chats`).then(response => response.data).catch(e => { console.error("chats DATA: ", e) })
export const getChatData = async (uuid: any): Promise<IChatsDataAll> => axiosInstance.get(`/chat/${uuid}`).then(response => response.data).catch(e => { console.error("chat current DATA: ", e) })
export const getChatMessages = async (uuid: any): Promise<IMessagesInChat> => axiosInstance.get(`/chat-messages/${uuid}`).then(response => response.data).catch(e => { console.error("chat messages DATA: ", e) })