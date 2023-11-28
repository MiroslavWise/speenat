import { FC } from "react"
import moment from "moment"
import Image from "next/image"

import { Typography } from "antd/lib"

import loadImage from "functions/load-image"
import { srcImage } from "functions/src-image"
import { replaceHttps } from "functions/replace-https"

interface IProps {
    uuid: string | number
    photo: string
    id: string
    messages: {
        text: string
        key: string
        time: string
    }[]
    name: string
}

const { Text } = Typography

const itemAlign = (i: number, length: number): string => {
    if (length === 1) {
        return "middle"
    }

    if (i === 0) {
        return "start"
    }

    if (i === length - 1) {
        return "end"
    }

    return ""
}

const ItemMessageCompanion: FC<IProps> = ({ uuid, photo, messages, name, id }) => {
    return (
        <div className="item-container-companion">
            <div>
                <Image loader={loadImage} height={30} width={30} src={replaceHttps(srcImage(photo))} alt={"a"} />
            </div>
            <div className="block-messages">
                {messages?.map((item, index) => (
                    <div className={`item-message ${itemAlign(index, messages?.length)}`} key={item?.key}>
                        <p>{item?.text}</p>
                    </div>
                ))}
                <p className="time" id={id}>
                    {moment.utc(messages?.at(-1)?.time).format("HH:mm")}
                </p>
            </div>
        </div>
    )
}

const ItemMessageMy: FC<IProps> = ({ uuid, photo, messages, name, id }) => {
    return (
        <div className="item-container-my">
            <div className="container-my">
                <div className="block-messages">
                    {messages?.map((item, index) => (
                        <div className={`item-message ${itemAlign(index, messages?.length)}`} key={item?.key}>
                            <p>{item?.text}</p>
                        </div>
                    ))}
                    <p className="time" id={id}>
                        {moment.utc(messages?.at(-1)?.time).format("HH:mm")}
                    </p>
                </div>
                <div>
                    <Image loader={loadImage} height={30} width={30} src={replaceHttps(srcImage(photo))} alt="v" />
                </div>
            </div>
        </div>
    )
}

export { ItemMessageCompanion, ItemMessageMy }
