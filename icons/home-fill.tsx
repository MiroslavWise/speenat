import { FC } from "react"


interface IProps{
        size?: number | string
        fill?: string
}

const HomeFill: FC<IProps> = ({ size = 20, fill = "#999" }) => {
        
        return (
                <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: fill }} >
                        <path d="M12.74 2.32a1 1 0 0 0-1.48 0l-9 10A1 1 0 0 0 3 14h2v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7h2a1 1 0 0 0 1-1 1 1 0 0 0-.26-.68z"></path>
                </svg>
        )
}

export default HomeFill