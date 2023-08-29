import { FC, MouseEvent } from "react";
import { useRouter } from "next/router";
import Image from "next/image"

import { updateStatus } from "api/api-status";
import { useAuth } from "store/use-auth";

import styles from "../../styles/left-arrow.module.scss"

const MenuDots: FC = () => {
        const { push } = useRouter()
        const out = useAuth(state => state.out)

        const handleOut = (event: MouseEvent<HTMLDivElement>) => {
                event.preventDefault()
                event.stopPropagation()
                updateStatus("offline")
                requestAnimationFrame(() => {
                        if (out) out()
                        push("/")
                })
        }

        return (
                <Image 
                        className={styles.exit}
                        onClick={handleOut}
                        src="/svg/log-out.svg"
                        alt="log-out"
                        height={34}
                        width={34}
                />
        )
}

export default MenuDots