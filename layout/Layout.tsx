import { useRouter } from "next/router"
import { Inter } from "@next/font/google"
import { type FC, type ReactNode, useEffect } from "react"

import Header from "./Header"
import Loader from "@loader-spin"
import NavFooter from "./NavFooter"
import ModalMenu from "components/modal-menu"

import { useUser } from "store/use-user"
import { ModalReferral } from "template"
import { ModalCall } from "components/modal-call"
import { ProviderWebSocket } from "context/WebSocketContext"
import { useVisibleModalReferral } from "store/use-visible-modal-referral"
import { ContextJanusVideoRoom } from "context/ContextJanusVideoRoom"

const inter = Inter({
    preload: true,
    subsets: ["latin"],
})

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter()
    const getUser = useUser(({ getUserData }) => getUserData)
    const loading = useUser(({ loading }) => loading)
    const visible = useVisibleModalReferral(({ visible }) => visible)

    useEffect(() => getUser(true), [])

    if (loading) return <Loader />

    return (
        <>
            <main
                className={`${inter.className} show-animate`}
                style={{ width: "100%", minHeight: "100vh", position: "relative" }}
            >
                <Header />
                <div key={router.route}>{children}</div>
                <NavFooter />
                <ModalMenu />
                <ModalCall />
            </main>
            {visible && <ModalReferral />}
        </>
    )
}

const WebSocket: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <ProviderWebSocket>
            <ContextJanusVideoRoom>
                <Layout>{children}</Layout>
            </ContextJanusVideoRoom>
        </ProviderWebSocket>
    )
}

export default WebSocket
