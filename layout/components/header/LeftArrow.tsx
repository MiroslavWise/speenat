import { FC } from "react"
import { useRouter } from "next/router"

import ChevronLeft from "@icons-chevron-left"

import styles from "../../styles/left-arrow.module.scss"

const LeftArrow: FC = () => {
        const { back } = useRouter()

        const onCancel = () => back()

        return (
                <div className={styles.container} onClick={onCancel}>
                        <ChevronLeft fill="#33367c" size={14} />
                </div>
        )
}

export default LeftArrow