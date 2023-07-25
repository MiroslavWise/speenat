import { FC, useState } from "react";
import { useQuery } from "react-query";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/router";

import { Pagination } from "antd";

import Loader from "@loader-spin";
import { MotionUL } from "components/motion/MotionUL";
import { MotionLI } from "components/motion/MotionLI";

import { useUser } from "store/use-user";
import loadImage from "functions/load-image";
import { archives } from "api/api-user";
import { statusCallConf } from "functions/status-conf";
import { replaceHttps } from "functions/replace-https";

const ListArchive: FC = () => {
        const [page, setPage] = useState(1)
        const { push } = useRouter()
        const userId = useUser(state => state.user?.profile?.profile_id)
        const loading = useUser(state => state.loading)
        const isSpeaker = useUser(state => state.is_speaker)
        const { data, isLoading } = useQuery(['archive', userId, page], () => archives(page))

        const srcImage = (item: string) => {
                if (item?.includes('default')) {
                        return '/images/default.png'
                } else {
                        return item
                }
        }

        if (isLoading || loading) return <Loader />

        return (
                <div className="content-archive">
                        <div className="header-archive" />
                        <MotionUL classNames={["list-archive"]}>
                                {
                                        data && data?.results?.length > 0
                                        &&
                                        data?.results?.map(item => (
                                                <MotionLI
                                                        key={item?.uuid}
                                                        classNames={["item-archive", "cursor-pointer"]}
                                                        onClick={() => {
                                                                push(`/archive/${item?.uuid}`)
                                                        }}
                                                >
                                                        <Image
                                                                loader={loadImage}
                                                                src={srcImage((isSpeaker && item?.student_profile?.photo_url) ? replaceHttps(item?.student_profile?.photo_url) : item?.speaker?.profile?.photo_url ? replaceHttps(item?.speaker?.profile?.photo_url) : 'default')}
                                                                alt="photo"
                                                                height={100}
                                                                width={100}
                                                                className="avatar"
                                                        />
                                                        <div className="descriptions">
                                                                <p>{isSpeaker ? "Студент: " : "Спикер: "} <span>{isSpeaker ? item?.student_profile?.full_name : item?.speaker?.profile?.full_name}</span></p>
                                                                <p>Про-сть сессии: <span>{item?.conference_time?.sessions_time}</span></p>
                                                                <p>Дата сессии: <span>{dayjs(item?.created_at).format("HH:mm DD/MM/YYYY")}</span></p>
                                                                <p>Статус: <span style={{ color: statusCallConf(item?.status)?.color }}>{statusCallConf(item?.status).title}</span></p>
                                                        </div>
                                                </MotionLI>
                                        ))
                                }
                                {
                                        data && data?.count < 11
                                                ? null
                                                : <Pagination
                                                        current={page}
                                                        total={data?.count || 0}
                                                        onChange={setPage}
                                                        defaultPageSize={10}
                                                        showSizeChanger={false}
                                                />
                                }
                        </MotionUL>
                </div>
        )
}

export default ListArchive