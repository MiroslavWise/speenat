import { FC } from "react"


interface IProps{
        size?: number | string
        fill?: string
}

const BookContentFill: FC<IProps> = ({ size = 20, fill = "#999" }) => {
        
        return (
                <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: fill }} >
                        <path d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm-1 4v2h-5V7h5zm-5 4h5v2h-5v-2zM4 19V5h7v14H4z"></path>
                </svg>
        )
}

export default BookContentFill