import { Button } from "antd"
import { NextPage } from "next"
import { useState } from "react"

import DrawerSearch from "components/teachers/DrawerSearch"


export async function getServerSideProps(context: any) {

        return {
                props: {

                }
        }
}

const Teachers: NextPage = () => {
        const [open, setOpen] = useState(false)

        const handleOpen = () => setOpen(true)

        return (
                <div className="wrapper teachers">
                        <Button className="button-search" onClick={handleOpen}>
                                <p>Параметры поиска</p>
                        </Button>
                        <div className="descriptions">
                                <p>
                                        Извините, но преподавателей по данному запросу нет, но вы можете открыть весь список, и записаться на определённое время <span style={{color: 'var(--secondary-color)'}} onClick={handleOpen}>открыть</span>
                                </p>
                        </div>
                        <DrawerSearch
                                open={open}
                                setOpen={setOpen}
                        />
                </div>
        )
}

export default Teachers