import { FC, MouseEvent } from "react";

import DotsHorizontalRounded from "@icons-dots-horizontal-rounded";

import { useModal } from "store/use-modal";

import styles from "../../styles/left-arrow.module.scss"

const MenuDots: FC = () => {
        const set = useModal(state => state.setActive)

        const handleActive = (event: MouseEvent<HTMLDivElement>): void => {
                event.preventDefault()
                event.stopPropagation()
                set(true)
        }

        return (
                <div className={styles.container} onClick={handleActive}>
                        <DotsHorizontalRounded  fill="#33367c" size={14} />
                </div>
        )
}

export default MenuDots