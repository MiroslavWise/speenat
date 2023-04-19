import { FC } from "react"
import { useRouter } from "next/router"

import ChevronLeft from "@icons-chevron-left"

const LeftArrow: FC = () => {
        const { back } = useRouter()

        const onCancel = () => back()

        return (
                <div className="left-arrow" onClick={onCancel}>
                        <ChevronLeft fill="#33367c" size={31} />
                </div>
        )
}

export default LeftArrow