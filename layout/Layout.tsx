import { type FC, type ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/router"
import { motion } from "framer-motion"
import { Inter } from "@next/font/google"
import { shallow } from "zustand/shallow"

import NavFooter from "./NavFooter"
import Header from "./Header"
import Loader from "@loader-spin"
import ModalMenu from "components/modal-menu"

import { useUser } from "store/use-user"
import { ProviderWebSocket } from "context/WebSocketContext"
import { ContextJanusVideoRoom } from "context/ContextJanusVideoRoom"
import { ModalCall } from "components/modal-call"

const inter = Inter({
    preload: true,
    subsets: ["latin"],
})

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter()
    const getUser = useUser(({ getUserData }) => getUserData)
    const loading = useUser(({ loading }) => loading)

    useEffect(() => getUser(true), [])

    if (loading) return <Loader />

    return (
        <main
            className={`${inter.className} show-animate`}
            style={{ width: "100%", minHeight: "100vh", position: "relative" }}
        >
            <Header />
            <motion.div
                key={router.route}
                initial="pageInitial"
                animate="pageAnimate"
                exit="pageExit"
                variants={{
                    pageInitial: {
                        opacity: 0,
                    },
                    pageAnimate: {
                        opacity: 1,
                    },
                    pageExit: {
                        opacity: 0,
                    },
                }}
            >
                {children}
            </motion.div>
            <NavFooter />
            <ModalMenu />
            <ModalCall />
        </main>
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
