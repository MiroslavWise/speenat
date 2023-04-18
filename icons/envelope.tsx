import { FC } from "react"


interface IProps{
        size?: number | string
        fill?: string
}

const Envelope: FC<IProps> = ({ size = 20, fill = "#fff" }) => {
        
        return (
                <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: fill }} >
                        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
                </svg>
        )
}

export default Envelope