import { FC } from "react";
import { useRouter } from "next/router";
import Image from "next/image";


import loadImage from "functions/load-image";

import { IProfile } from "types/store/profiles";

const ItemSpeaker: FC<IProfile> = ({id, profile:{full_name, avatar_url}, specialization, consultation_time}) => {
        const { push } = useRouter()
        
        return (
                <div
                        className="item-profile"
                        onClick={() => push(`/teachers/${id}`)}
                >
                        <Image
                                loader={loadImage}
                                src={avatar_url}
                                alt="av"
                                height={59}
                                width={59}
                                className="avatar"
                        />
                        <div className="item-data">
                                <div className="_main">
                                        <p className="name">{full_name}</p>
                                        <p className="spec_name">{specialization?.name}</p>
                                        {
                                                consultation_time?.map(item => (
                                                        <p className=" sessions_name" key={`${item?.price}${id}_spec_${item?.id}`}>{item?.sessions_time} - <span>{ item?.price }₸</span></p>
                                                ))
                                        }
                                        
                                </div>
                                <div className="_second">

                                </div>
                        </div>
                </div>
        )
}

export default ItemSpeaker