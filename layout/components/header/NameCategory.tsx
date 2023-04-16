import { FC } from "react"
import { useRouter } from "next/router"

import { nameRoute } from "functions/name-route"

const NameCategory: FC = () => {
        const { asPath } = useRouter()

        return (
                <div className="name-category">
                        <p>{ nameRoute(asPath) }</p>
                </div>
        )
}

export default NameCategory