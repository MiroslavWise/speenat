import { FC, MouseEvent, useEffect, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useRouter } from "next/router"

import { Input } from "antd/lib"

import Loader from "@loader-spin"
import TelegramIcon from "@icons-telegram"

import { useUser } from "store/use-user"
import { useWeb } from "context/WebSocketContext"
import { IReturnMessages, joinMessages } from "functions/join-messages"
import { getChatMessages } from "api/api-chat"
import { ItemMessageCompanion, ItemMessageMy } from "./item-message"

interface IProps {
    id_speaker: number | undefined
    id_student: number | undefined
}

const Messages: FC<IProps> = ({ id_speaker, id_student }) => {
    const {
        query: { uuid },
    } = useRouter()
    const [value, setValue] = useState<string | undefined>(undefined)
    const { wsChannel } = useWeb()
    const isSpeaker = useUser((state) => state.is_speaker)
    const userId = useUser((state) => state.user?.profile?.profile_id)
    const { data, isLoading, refetch } = useQuery(["chat_messages", uuid], () => getChatMessages(uuid))

    useEffect(() => {
        console.log("join messages: ", joinMessages(data?.results || []))
    }, [data])

    useEffect(() => {
        const eventMessage = (event: MessageEventInit<any>) => {
            const response = JSON.parse(event?.data)?.data
            if (response?.message_info?.chat_uuid === uuid && response?.type === "message_notification") {
                refetch()
            }
            if (response?.message === "receive ok!") {
                refetch()
            }
        }

        wsChannel?.addEventListener("message", eventMessage)

        return () => wsChannel?.removeEventListener("message", eventMessage)
    }, [wsChannel])

    const messages: IReturnMessages[] = useMemo(() => {
        if (data && data?.results?.length > 0) {
            return joinMessages(data?.results?.reverse() || [])
        }
        return []
    }, [data?.results])

    useEffect(() => {
        if (messages?.length) {
            const elem = document.getElementById(messages?.at(-1)?.id || "")
            elem?.scrollIntoView({
                behavior: "auto",
                block: "end",
            })
        }
    }, [JSON.stringify(messages)])

    const handleMessage = (event: MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        event.defaultPrevented = true
        wsChannel?.send(
            JSON.stringify({
                data: {
                    type: "chat_message",
                    receiver_id: isSpeaker ? id_student : id_speaker,
                    chat_uuid: uuid,
                    sender_id: !isSpeaker ? id_student : id_speaker,
                    text: value,
                },
            }),
        )
        requestAnimationFrame(() => setValue(""))
    }

    if (isLoading) return <Loader />

    return (
        <div className="current-chat-container">
            <div className="current-messages">
                {messages.map((item) => {
                    if (item?.uuid === userId) {
                        return (
                            <ItemMessageMy
                                key={`${item?.uuid}_ItemMessageMy_${item?.messages[0]?.key}`}
                                uuid={item?.uuid}
                                photo={item?.photo}
                                name={item?.name}
                                messages={item?.messages}
                                id={item?.id}
                            />
                        )
                    } else {
                        return (
                            <ItemMessageCompanion
                                key={`${item?.uuid}_ItemMessageCompanion_${item?.messages[0]?.key}`}
                                uuid={item?.uuid}
                                photo={item?.photo}
                                name={item?.name}
                                messages={item?.messages}
                                id={item?.id}
                            />
                        )
                    }
                })}
            </div>
            <div className="current-input-message">
                <Input
                    value={value}
                    onChange={(t) => setValue(t.target.value)}
                    style={{ height: 25, width: "calc(100% - 35px)" }}
                    onDragEnter={handleMessage}
                />
                <div className=" cursor-pointer" onClick={handleMessage}>
                    <TelegramIcon fill="var(--premium-color)" size={25} />
                </div>
            </div>
        </div>
    )
}

export default Messages
