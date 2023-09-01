import { NextPage } from "next"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import Image from "next/image"
import moment from "moment"
import { useTranslation } from "react-i18next"

import Loader from "@loader-spin"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useUser } from "store/use-user"
import { replaceHttps } from "functions/replace-https"
import { srcImage } from "functions/src-image"
import { chatsAll } from "api/api-chat"
import loadImage from "functions/load-image"

const Chats: NextPage = () => {
    const { t } = useTranslation()
    const { push } = useRouter()
    const { data, isLoading } = useQuery(["chats"], () => chatsAll())
    const loadingUser = useUser((state) => state.loading)
    const isSpeaker = useUser((state) => state.is_speaker)
    useDocumentTitle(t("Chat"))

    if (isLoading || loadingUser) return <Loader />

    return (
        <div className="content-archive">
            <div className="list-archive">
                {data && data?.length > 0
                    ? data?.map((item) => (
                        <div
                            className="item-chat"
                            key={item?.uuid}
                            onClick={() => {
                                push(`/chat/${item?.uuid}`, undefined, { shallow: true })
                            }}
                        >
                            <Image
                                loader={loadImage}
                                src={replaceHttps(
                                    srcImage(isSpeaker ? item?.student?.photo_url : item?.speaker?.photo_url),
                                )}
                                alt="photo"
                                height={80}
                                width={80}
                                className="avatar"
                            />
                            <div className="description-chat">
                                <p className="full-name-class">
                                    {isSpeaker ? item?.student?.full_name : item?.speaker?.full_name}
                                </p>
                                <div className="last-messages">
                                    <p>{item?.messages[0]?.text}</p>
                                </div>
                                <div className="time-message">
                                    <i>{moment.utc(item?.messages?.[0]?.created_at).format("HH:mm DD.MM.YY")}</i>
                                </div>
                            </div>
                        </div>
                    ))
                    : null}
            </div>
        </div>
    )
}

export default Chats
