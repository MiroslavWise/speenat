import { FC } from "react"


interface IProps{
        size?: number | string
        fill?: string
}

const CreditCardAlt: FC<IProps> = ({ size = 20, fill = "#fff" }) => {
        
        return (
                <svg width={size} height={size} viewBox="0 0 24 24" style={{ fill: fill }} >
                        <circle cx="15.5" cy="13.5" r="2.5"></circle>
                        <path d="M12 13.5c0-.815.396-1.532 1-1.988A2.47 2.47 0 0 0 11.5 11a2.5 2.5 0 1 0 0 5 2.47 2.47 0 0 0 1.5-.512 2.486 2.486 0 0 1-1-1.988z"></path>
                        <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zM4 18V6h16l.002 12H4z"></path>
                </svg>
        )
}

export default CreditCardAlt