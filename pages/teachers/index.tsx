import { Button } from "antd"
import { NextPage } from "next"
import { useEffect, useState } from "react"

import DrawerSearch from "components/teachers/DrawerSearch"
import ListSpeaker from "components/teachers/ListSpeaker"

import { useProfiles } from "store/use-profiles"

const Teachers: NextPage = () => {
        const [open, setOpen] = useState(false)
        const get = useProfiles(state => state.getProfiles)
        const handleOpen = () => setOpen(true)

        useEffect(() => {
                get()
        }, [])

        return (
                <div className="wrapper teachers">
                        <Button className="button-search" onClick={handleOpen}>
                                <p>Параметры поиска</p>
                        </Button>
                        <ListSpeaker
                                handleOpen={handleOpen}
                        />
                        <DrawerSearch
                                open={open}
                                setOpen={setOpen}
                        />
                </div>
        )
}

export default Teachers