import { type FC, type ReactNode, createContext } from "react"

import type { IAuthContext } from "types/auth"

import GatesComponent from "authorization/GatesComponent"
import SignInComponent from "authorization/SignInComponent"

import { useUser } from "store/use-user"
import { useAuth, type TAuthContext } from "store/use-auth"
import { useCallJanus, usePropsCallingJanus } from "store/use-call-janus"

const AuthorizationContext = createContext<IAuthContext | undefined>(undefined)

export const Authorization: FC<{ children: ReactNode }> = ({ children }) => {
    const getReset = useUser(({ getReset }) => getReset)
    const deleteAllPropsJanus = usePropsCallingJanus(({ deleteAll }) => deleteAll)
    const deleteTime = useCallJanus(({ deleteTime }) => deleteTime)
    const out = useAuth(({ out }) => out)
    const state = useAuth(({ state }) => state)

    const Routers: Record<TAuthContext, ReactNode> = {
        Gates: <GatesComponent />,
        SignIn: <SignInComponent />,
        Main: children,
    }

    async function signOut(): Promise<any> {
        return getReset().finally(() => {
            deleteAllPropsJanus()
            deleteTime()
            if (out) out()
        })
    }

    const ShowComponent = Routers[state || "Gates"]

    return <AuthorizationContext.Provider value={{ signOut: signOut }}>{ShowComponent}</AuthorizationContext.Provider>
}
