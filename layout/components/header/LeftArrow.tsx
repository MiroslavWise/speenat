import { FC } from "react"
import Image from "next/image"
import { useRouter } from "next/router"

import styles from "../../styles/left-arrow.module.scss"
import { useUser } from "store/use-user"

const LeftArrow: FC = () => {
        const { push } = useRouter()
        const isSpeaker = useUser(state => state.is_speaker)

        const onCancel = () => {
                if (isSpeaker) {
                        push(`/archive`, undefined, { shallow: true })
                } else {
                        push(`/teachers`, undefined, { shallow: true })
                }
        }

        return (
                <Image
                        className={styles.container}
                        onClick={onCancel}
                        src="/images/speanat-icon.png"
                        alt="icon"
                        width={20}
                        height={34}
                        style={{ objectFit: "cover", aspectRatio: 1 / 1 }}
                        unoptimized
                />
        )
}

export default LeftArrow