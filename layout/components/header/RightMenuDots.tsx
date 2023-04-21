import DotsHorizontalRounded from "@icons-dots-horizontal-rounded";
import { FC, MouseEvent } from "react";


import { useModal } from "store/use-modal";


const MenuDots: FC = () => {
        const set = useModal(state => state.setActive)

        const handleActive = (event: MouseEvent<HTMLDivElement>): void => {
                event.preventDefault()
                event.stopPropagation()
                set(true)
        }

        return (
                <div className="menu-dots" onClick={handleActive}>
                        <DotsHorizontalRounded  fill="#33367c" size={31} />
                </div>
        )
}

export default MenuDots