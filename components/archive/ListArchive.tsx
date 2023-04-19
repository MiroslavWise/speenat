import { FC, useState } from "react";
import { useQuery } from "react-query";
import Image from "next/image";

import { Pagination } from "antd";

import Loader from "@loader-spin";

import { useUser } from "store/use-user";
import loadImage from "functions/load-image";
import { archives } from "api/api-user";
import { statusCallConf } from "functions/status-conf";

const ListArchive: FC = () => {
        const [page, setPage] = useState(1)
        const userId = useUser(state => state.user?.profile?.profile_id)
        const loading = useUser(state => state.loading)
        const isSpeaker = useUser(state => state.is_speaker)
        const { data, isLoading } = useQuery(['archive', userId, page], () => archives())

        const srcImage = (item: string) => {
                if (item?.includes('default')) {
                        return '/images/default.png'
                } else {
                        return item 
                }
        }

        if(isLoading || loading) return <Loader />

        return (
                <div className="content-archive">
                        <div className="header-archive" />
                        <div className="list-archive">
                                {
                                        data && data?.results?.length > 0
                                        &&
                                        data?.results?.map(item => (
                                                <div 
                                                        key={item?.uuid}
                                                        className="item-archive"
                                                >
                                                        <Image
                                                                loader={loadImage}
                                                                src={srcImage((isSpeaker && item?.student_profile?.photo_url) ? item?.student_profile?.photo_url : item?.speaker?.profile?.photo_url ? item?.speaker?.profile?.photo_url : 'default')}
                                                                alt="photo"
                                                                height={100}
                                                                width={100}
                                                                className="avatar"
                                                        />
                                                        <div className="descriptions">
                                                                <p>{isSpeaker ? "Студент: " : "Спикер: "} <span>{ isSpeaker ? item?.student_profile?.full_name : item?.speaker?.profile?.full_name}</span></p>
                                                                <p>Про-сть сесии: <span>{ item?.conference_time?.sessions_time }</span></p>
                                                                <p>Оплата: <span>{item?.conference_time?.price}₸</span></p>
                                                                <p>Статус: <span style={{ color: statusCallConf(item?.status)?.color }}>{statusCallConf(item?.status).title}</span></p>
                                                                {
                                                                        item?.record_url !== "not_found"
                                                                                ? <p>Видео: <a href={item?.record_url}>Скачать</a></p>
                                                                                : null
                                                                }
                                                        </div>
                                                </div>
                                        ))
                                }
                                {
                                        data &&data?.count < 6
                                                ? null
                                                : <Pagination
                                                        current={page}
                                                        total={data?.count || 0}
                                                        onChange={setPage}
                                                        defaultPageSize={5}
                                                        showSizeChanger={false}
                                                />
                                }
                        </div>
                </div>
        )
}

export default ListArchive