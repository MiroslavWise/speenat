import { NextPage } from "next"

import ListArchive from "components/archive/ListArchive"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { Button } from "antd/lib"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import DrawerSearch from "components/teachers/DrawerSearch"

const Archive: NextPage = () => {
    useDocumentTitle("SessionArchive")
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    return (
        <div>
            <Button className="button-search" onClick={handleOpen} style={{ marginTop: "10px" }}>
                <p>{t("Search Parameters")}</p>
            </Button>
            <ListArchive />
            <DrawerSearch open={open} setOpen={setOpen} />
        </div>
    )
}

export default Archive
