import { useEffect, useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

import { Button } from "antd"

import Loader from "@loader-spin"
import DrawerSearch from "components/teachers/DrawerSearch"
import ListSpeaker from "components/teachers/ListSpeaker"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useUser } from "store/use-user"

const Teachers: NextPage = () => {
    const { t } = useTranslation()
    const { push } = useRouter()
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    useDocumentTitle("Teachers")

    const isSpeaker = useUser((state) => state.is_speaker)
    const loadingUser = useUser((state) => state.loading)

    useEffect(() => {
        if (isSpeaker) {
            push("/archive", undefined)
        }
    }, [isSpeaker])

    if (loadingUser) return <Loader />

    return (
        <div className="wrapper teachers">
            <Button className="button-search" onClick={handleOpen}>
                <p>{t("Search Parameters")}</p>
            </Button>
            <ListSpeaker handleOpen={handleOpen} />
            <DrawerSearch open={open} setOpen={setOpen} />
        </div>
    )
}

export default Teachers