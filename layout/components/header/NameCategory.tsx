import { FC } from "react"
import { useRouter } from "next/router"

import { nameRoute } from "functions/name-route"
import { useTranslation } from "react-i18next"

const NameCategory: FC = () => {
        const { t } = useTranslation()
        const { asPath, query } = useRouter()

        return (
                <div className="name-category">
                        <p>{nameRoute(asPath, t, query?.name as (string | undefined))}</p>
                </div>
        )
}

export default NameCategory