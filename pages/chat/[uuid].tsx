import { useEffect } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import Loader from "@loader-spin";
import Messages from "components/chat/Messages";

import { useUser } from "store/use-user";
import { getChatData } from "api/api-chat";

const CurrentChatUUID: NextPage = () => {
        const { query, push } = useRouter()
        const { data, isLoading } = useQuery(["chat_data", query.uuid], () => getChatData(query.uuid), { refetchOnWindowFocus: false })
        const loadingUser = useUser(state => state.loading)
        const isSpeaker = useUser(state => state.is_speaker)

        useEffect(() => {
                if (isSpeaker && !loadingUser && data) {
                        push(`/chat/${query?.uuid}?name=${data?.speaker?.full_name?.replaceAll(' ', '_')}`, undefined, { shallow: true })
                }
        }, [data?.uuid, isSpeaker, loadingUser])

        if (isLoading || loadingUser) return <Loader />

        return (
                <div className="content-archive">
                        <div className="header-archive" />
                        <Messages
                                id_speaker={data?.speaker?.id}
                                id_student={data?.student?.id}
                        />
                </div>
        )
}

export default CurrentChatUUID