import { FC } from "react"


interface IProps{
        size?: number | string
        fill?: string
}

const UserFill: FC<IProps> = ({ size = 20, fill = "#999" }) => {
        
        return (
                <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: fill }} >
                        <path d="M7.5 6.5C7.5 8.981 9.519 11 12 11s4.5-2.019 4.5-4.5S14.481 2 12 2 7.5 4.019 7.5 6.5zM20 21h1v-1c0-3.859-3.141-7-7-7h-4c-3.86 0-7 3.141-7 7v1h17z"></path>
                </svg>
        )
}

export default UserFill