import { DispatchWithoutAction, FC, useEffect } from "react";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";

import ItemSpeaker from "./ItemSpeaker";

import { MotionUL } from "components/motion/MotionUL";

import { useWeb } from "context/WebSocketContext";
import { useProfiles } from "store/use-profiles";
import { speakers } from "api/api-user"

const ListSpeaker: FC<{ handleOpen: DispatchWithoutAction }> = ({ handleOpen }) => {
        const { t } = useTranslation()
        const filters = useProfiles(state => state.filters)
        const { wsChannel } = useWeb()

        const { data, isLoading, refetch } = useQuery(["speakers", filters.page, filters.price_gte, filters.price_lte, filters.speaker__status, filters.spec_rating, filters.verified], () => speakers(filters))

        useEffect(() => {
                const eventUpdate = (event: MessageEventInit<any>) => {
                        const lastMessage: any = JSON.parse(event?.data)
                        if (lastMessage?.data?.type === "update_speaker_list") {
                                refetch()
                        }
                }
                if (wsChannel) {
                        wsChannel?.addEventListener('message', eventUpdate)
                }

                return () => wsChannel?.removeEventListener('message', eventUpdate)

        }, [wsChannel])

        return (
                <div className="container-list-speaker">
                        {
                                data?.count === 0 && isLoading === false
                                && (
                                        <div className="descriptions">
                                                <p>
                                                        {t("Welcome to Spenat. You're online. You can choose the media for communication or use")} <span style={{ color: 'var(--secondary-color)' }} onClick={handleOpen}>{t("search_")}</span>
                                                </p>
                                        </div>
                                )
                        }
                        {
                                data && data?.results?.length > 0 && isLoading === false ? (
                                        <MotionUL classNames={["teacher-list"]}>
                                                {data?.results?.map(item => (<ItemSpeaker {...item} key={`${item?.id}_item_speaker`} />))}
                                        </MotionUL>
                                ) : (
                                                null
                                        )
                        }
                </div>
        )
}

export default ListSpeaker