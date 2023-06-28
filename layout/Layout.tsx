import { type FC, type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { Inter } from '@next/font/google'
import { shallow } from 'zustand/shallow'

import NavFooter from "./NavFooter";
import Header from "./Header";
import Loader from "@loader-spin";
import ModalMenu from "components/modal-menu";

import { useUser } from "store/use-user";
import { ProviderWebSocket, useWeb } from "context/WebSocketContext";
import { ProviderJanusContext } from "context/ContextJanus";
import { ModalCall } from 'components/modal-call'
import { ICallData } from "types/call";

const inter = Inter({
        preload: true,
        subsets: ["latin"],
})

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
        const router = useRouter();
        const [propsCall, setPropsCall] = useState<ICallData | null>(null)
        const { getUser, loading, isSpeaker, isAdmin, isAccountant } = useUser(state => ({
                getUser: state.getUserData,
                loading: state.loading,
                isSpeaker: state.is_speaker,
                isAdmin: state.is_admin,
                isAccountant: state.is_staff,
                profile: state.user?.profile,
        }), shallow) ?? {}
        const contextSocket = useWeb() ?? {}
        const wsChannel = contextSocket?.wsChannel

        useEffect(() => {
                const listenerCall = (event: any) => {
                        const notification: ICallData = JSON.parse(event.data).data

                        if (notification?.type === "call_accept_ok") {
                                console.log('notification isDoctor: ', notification)
                                setPropsCall({ ...notification })
                        }
                }
                wsChannel?.addEventListener('message', listenerCall)

                return () => wsChannel?.removeEventListener("message", listenerCall)
        }, [wsChannel])

        useEffect(() => getUser(true), [])
        if (loading) return <Loader />

        return (
                        <ProviderJanusContext>
                                <main className={`${inter.className} show-animate`} style={{ width: '100%', minHeight: '100vh', position: "relative" }}>
                                        <Header />
                                        <motion.div
                                                key={router.route}
                                                initial="pageInitial"
                                                animate="pageAnimate"
                                                exit="pageExit"
                                                variants={{
                                                        pageInitial: {
                                                                opacity: 0
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
                                        <ModalCall
                                                propsCall={propsCall}
                                                setPropsCall={setPropsCall}
                                        />
                                </main>
                        </ProviderJanusContext>
        )
}

const WebSocket: FC<{ children: ReactNode }> = ({ children }) => {

        return (
                <ProviderWebSocket>
                        <Layout>
                                {children}
                        </Layout>
                </ProviderWebSocket>
        )
}

export default WebSocket