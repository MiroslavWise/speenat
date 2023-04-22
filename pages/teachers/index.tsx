import { useEffect, useState } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"

import { Button } from "antd"

import DrawerSearch from "components/teachers/DrawerSearch"
import ListSpeaker from "components/teachers/ListSpeaker"

import Loader from "@loader-spin"
import { useUser } from "store/use-user"

const Teachers: NextPage = () => {
        const { push } = useRouter()
        const [open, setOpen] = useState(false)
        const handleOpen = () => setOpen(true)

        const isSpeaker = useUser(state => state.is_speaker)
        const loadingUser = useUser(state => state.loading)

        useEffect(() => {
                if (isSpeaker) {
                        push('/archive', undefined)
                }
        }, [])

        if(loadingUser) return <Loader />

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