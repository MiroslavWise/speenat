import { FC } from "react"

interface IProps {
    fill?: string
    size?: number
}

const Video: FC<IProps> = ({ fill = "#111", size = 20 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
            <path d="M18 7c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2v-3.333L22 17V7l-4 3.333V7zm-1.998 10H4V7h12l.001 4.999L16 12l.001.001.001 4.999z"></path>
        </svg>
    )
}

export default Video
