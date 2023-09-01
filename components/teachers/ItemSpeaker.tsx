import { FC } from "react"
import { useRouter } from "next/router"
import Image from "next/image"

import { MotionLI } from "components/motion/MotionLI"

import loadImage from "functions/load-image"

import { IProfile } from "types/store/profiles"
import { useTranslation } from "react-i18next"

const ItemSpeaker: FC<IProfile> = ({
    id,
    speaker_id,
    profile: { full_name, avatar_url, status },
    specialization,
    consultation_time,
}) => {
    const { t } = useTranslation()
    const { push } = useRouter()

    return (
        <MotionLI
            classNames={["teacher-card"]}
            onClick={() => push(`/teachers/${speaker_id}`)}
        >
            <div className="teacher-image">
                <Image
                    loader={loadImage}
                    src={avatar_url?.replace("http:/", "https:/")}
                    alt="av"
                    style={{ objectFit: "cover", borderRadius: 21 }}
                    height={100}
                    width={100}
                />
                <div
                    className={`teacher-status ${
                        status === "online"
                            ? "status-online"
                            : status === "busy"
                            ? "status-busy"
                            : "status-offline"
                    }`}
                />
            </div>
            <div className="description">
                <p className="teacher-name">{full_name}</p>
                <p className="teacher-specialization">{specialization?.name}</p>
                <ul className="teacher-prices">
                    {consultation_time.map((price) => (
                        <li key={`${price.sessions_time}_${price.price}`}>
                            {price.sessions_time?.replace(
                                "min",
                                ` ${t("mines")}`,
                            )}
                            : {price.price}₸
                        </li>
                    ))}
                </ul>
            </div>
        </MotionLI>
    )
}

export default ItemSpeaker