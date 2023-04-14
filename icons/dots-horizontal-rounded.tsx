import { FC } from "react"


interface IProps{
        size?: number | string
        fill?: string
}

const DotsHorizontalRounded: FC<IProps> = ({ size = 20, fill = "#000" }) => {
        
        return (
                <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: fill }} >
                        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                </svg>
        )
}

export default DotsHorizontalRounded