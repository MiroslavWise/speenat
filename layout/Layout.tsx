import { FC, ReactNode, useEffect } from "react";

import { Inter } from '@next/font/google'

import NavFooter from "./NavFooter";
import Header from "./Header";
import Loader from "@loader-spin";

import { useUser } from "store/use-user";
import { ProviderWebSocket } from "context/WebSocketContext";

const inter = Inter({
        preload: true,
        subsets: ["latin"],
})

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
        const getUser = useUser(state => state.getUserData)
        const loading = useUser(state => state.loading)
        useEffect(() => getUser(true), [])
        if(loading) return <Loader />

        return (
                <ProviderWebSocket>
                        <main className={`${inter.className} show-animate`} style={{ width: '100%', minHeight: '100vh', position: "relative" }}>
                                <Header />
                                <div style={{width: '100%', height: '100%'}}>
                                        {children}
                                </div>
                                <NavFooter />
                        </main>
                </ProviderWebSocket>
        )
}

export default Layout