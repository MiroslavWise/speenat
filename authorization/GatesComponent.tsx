import { FC, useEffect } from "react"

import { Spin } from "antd/lib"
import { useAuth } from "store/use-auth"

const GatesComponent: FC = () => {
    const { checkAuth } = useAuth((state) => ({ checkAuth: state.checkAuth }))

    useEffect(() => {
        if (checkAuth) {
            checkAuth()
        }
    }, [])

    return (
        <Spin
            size="large"
            spinning
            style={{ height: "100vh", width: "100vw", display: "grid", justifyContent: "center", alignItems: "center" }}
        />
    )
}

export default GatesComponent
