import { Dispatch, DispatchWithoutAction, FC, SetStateAction } from "react";

import ItemSpeaker from "./ItemSpeaker";

import { useProfiles } from "store/use-profiles";

const ListSpeaker: FC<{handleOpen: DispatchWithoutAction}> = ({handleOpen}) => {
        const profiles = useProfiles(state => state.profiles)
        const loading = useProfiles(state => state.loading)

        return (
                <div className="container-list-speaker">
                        {
                                profiles?.length === 0 && loading === false
                                && (
                                        <div className="descriptions">
                                                <p>
                                                        Извините, но преподавателей по данному запросу нет, но вы можете открыть весь список, и записаться на определённое время <span style={{color: 'var(--secondary-color)'}} onClick={handleOpen}>открыть</span>
                                                </p>
                                        </div>
                                )
                        }
                        {
                                profiles?.length > 0 && loading === false
                                ? (
                                        <div className="list-speaker">
                                                        {
                                                                profiles?.map(item => (<ItemSpeaker {...item} key={`${item?.id}_item_speaker`} />))
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