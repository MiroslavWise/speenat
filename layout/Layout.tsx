import { FC, ReactNode, useEffect } from "react";

import { Inter } from '@next/font/google'

import { useUser } from "store/use-user";
import NavFooter from "./NavFooter";
import Header from "./Header";

const inter = Inter({
        preload: true,
        subsets: ["latin"],
})

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
        const getUser = useUser(state => state.getUserData)

        useEffect(() => {
                getUser()
        }, [])
        
        return (
                <main className={inter.className} style={{ width: '100%', minHeight: '100vh', position: "relative" }}>
                        <Header />
                        {children}
                        <NavFooter />
                </main>
        )
}

export default Layout