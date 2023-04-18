import { FC, ReactNode, useEffect } from "react";

import { Inter } from '@next/font/google'

import { useUser } from "store/use-user";
import NavFooter from "./NavFooter";
import Header from "./Header";
import Loader from "@loader-spin";

const inter = Inter({
        preload: true,
        subsets: ["latin"],
})

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
        const getUser = useUser(state => state.getUserData)
        const loading = useUser(state => state.loading)
        useEffect(getUser, [])
        
        if(loading) return <Loader />

        return (
                <main className={`${inter.className} show-animate`} style={{ width: '100%', minHeight: '100vh', position: "relative" }}>
                        <Header />
                        <div style={{width: '100%', height: '100%'}}>
                                {children}
                        </div>
                        <NavFooter />
                </main>
        )
}

export default Layout