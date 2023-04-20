import { FC } from "react";
import { useRouter } from "next/router";
import Image from "next/image";


import loadImage from "functions/load-image";

import { IProfile } from "types/store/profiles";

const ItemSpeaker: FC<IProfile> = ({id, profile:{full_name, avatar_url, status}, specialization, consultation_time}) => {
        const { push } = useRouter()
        
        return (
                <div
                        className="teacher-card"
                        onClick={() => push(`/teachers/${id}`)}
                >
                        <div className="teacher-image">
                                <Image
                                        loader={loadImage}
                                        src={avatar_url}
                                        alt="av"
                                        style={{objectFit: 'cover', borderRadius: 21}}
                                        height={100}
                                        width={100}
                                />
                                <div className={`teacher-status ${status === "online" ? "status-online" : status === "busy" ? "status-busy" : "status-offline"}`} />
                        </div>
                        <div className="description">
                                <p className="teacher-name">{full_name}</p>
                                <p className="teacher-specialization">{specialization?.name}</p>
                                <ul className="teacher-prices">
                                        {consultation_time.map((price) => (
                                                <li key={`${price.sessions_time}_${price.price}`}>{price.sessions_time}: {price.price}₸</li>
                                        ))}
                                </ul>
                        </div>
                </div>
        )
}

export default ItemSpeaker