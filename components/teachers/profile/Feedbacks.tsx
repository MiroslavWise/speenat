import { FC, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import moment from "moment";
import Image from "next/image";

import { Rate } from "antd";

import Loader from "@loader-spin";

import { feedbackSpeakerId } from "api/api-user";
import loadImage from "functions/load-image";
import { replaceHttps } from "functions/replace-https";

const Feedbacks: FC<{}> = ({ }) => {
        const { query: { id } } = useRouter()
        const [page, setPage] = useState(1)

        const { data, isLoading } = useQuery(["feedback", `speaker_${id}`, `page_${page}`], () => feedbackSpeakerId(id, page))
        
        if(isLoading) return <Loader />

        return (
                <div className="container-feedback">
                        <p className="title">Отзывы о спикере</p>
                        <div className="list-feedback">
                                {
                                        data && data?.results?.length > 0
                                        ?
                                        data?.results?.map(item => (
                                                <div
                                                        className="item-feedback"
                                                        key={`item_feed_${item?.id}_${item?.created_at}`}
                                                >
                                                        <div className="header-feed">
                                                                <div style={{display: 'flex', flexDirection: 'row', gap: 10, }}>
                                                                        <Image
                                                                                loader={loadImage}
                                                                                src={(!item || item?.author?.avatar_url?.includes("default")) ? '/images/default.png' : item?.author?.avatar_url ? replaceHttps(item?.author?.avatar_url) : '/images/default.png'}
                                                                                alt="av"
                                                                                height={40}
                                                                                width={40}
                                                                                className="avatar"
                                                                        />
                                                                        <div className="name-time">
                                                                                <p className="name">{item?.author?.full_name}</p>
                                                                                <p className="sub-name">{ moment(item?.created_at).format("HH:mm DD.MM.YYYY") }</p>
                                                                        </div>
                                                                </div>
                                                        </div>
                                                        <div className="contain">
                                                                <p>{ item?.text }</p>
                                                        </div>
                                                        <div className="footer-feed">
                                                                <Rate
                                                                        disabled
                                                                        defaultValue={item?.rating || 0}
                                                                        className="rate-item"
                                                                />
                                                        </div>
                                                </div>
                                        )) : null
                                }
                        </div>

                </div>
        )
}

export default Feedbacks