import { FC } from "react"


interface IProps{
        size?: number | string
        fill?: string
}

const ChevronLeft: FC<IProps> = ({ size = 20, fill = "#000" }) => {
        
        return (
                <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: fill }} >
                        <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>
                </svg>
        )
}

export default ChevronLeft