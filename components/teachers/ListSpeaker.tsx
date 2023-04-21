import { DispatchWithoutAction, FC, useEffect } from "react";

import ItemSpeaker from "./ItemSpeaker";

import { useWeb } from "context/WebSocketContext";
import { useProfiles } from "store/use-profiles";
import { speakers } from "api/api-user"
import { useQuery } from "react-query";

const ListSpeaker: FC<{handleOpen: DispatchWithoutAction}> = ({handleOpen}) => {
        const filters = useProfiles(state => state.filters)
        const { lastMessage } = useWeb()

        const { data, isLoading, refetch } = useQuery(["speakers", filters.page, filters.price_gte, filters.price_lte, filters.speaker__status, filters.spec_rating, filters.verified], () => speakers(filters))

        useEffect(() => {
                if (lastMessage) {
                        const event: any = JSON.parse(lastMessage?.data)
                        if (event?.data?.type === "update_speaker_list") {
                                refetch()
                        }
                }

        }, [lastMessage])

        return (
                <div className="container-list-speaker">
                        {
                                data?.count === 0 && isLoading === false
                                && (
                                        <div className="descriptions">
                                                <p>
                                                        Извините, но преподавателей по данному запросу нет, но вы можете открыть весь список, и записаться на определённое время <span style={{color: 'var(--secondary-color)'}} onClick={handleOpen}>открыть</span>
                                                </p>
                                        </div>
                                )
                        }
                        {
                                data && data?.results?.length > 0 && isLoading === false ? (
                                        <div className="teacher-list">
                                                {
                                                        data?.results?.map(item => (<ItemSpeaker {...item} key={`${item?.id}_item_speaker`} />))
                                                }
                                        </div>
                                ) : (
                                                null
                                        )
                        }
                </div>
        )
}

export default ListSpeaker