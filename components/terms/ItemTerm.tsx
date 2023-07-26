import { FC, useState } from "react"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

import type { IDataTerms } from "./list-terms"

const ItemTerms: FC<IDataTerms & { index: number }> = ({ label, path, icon, index }) => {
        const { t } = useTranslation()
        const router = useRouter()

        const onPush = () => {
                router.push(path, undefined, { shallow: true })
        }

        return (
                <div
                        className={`item-term`}
                        style={{ animationDuration: `${index / 1.5}s` }}
                        onClick={onPush}
                >
                        <p>{t(label)}</p>
                </div>
        )
}

export default ItemTerms