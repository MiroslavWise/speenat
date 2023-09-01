import { useEffect } from "react"
import { useTranslation } from "react-i18next"

export const useDocumentTitle = (title: string) => {
    const { t } = useTranslation()
    useEffect(() => {
        document.title = t(title)
    }, [title])
}
