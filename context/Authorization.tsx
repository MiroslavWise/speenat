import { type FC, type ReactNode, createContext, useContext, useState } from "react"
import { shallow } from "zustand/shallow"

import type { IAuthContext } from "types/auth"

import GatesComponent from "authorization/GatesComponent"
import SignInComponent from "authorization/SignInComponent"

import { useUser } from "store/use-user"
import { useAuth, type TAuthContext } from "store/use-auth"
import { useCallJanus, usePropsCallingJanus } from "store/use-call-janus"

const AuthorizationContext = createContext<IAuthContext | undefined>(undefined)

export const Authorization: FC<{ children: ReactNode }> = ({ children }) => {
        const getReset = useUser(state => state.getReset)
        const deleteAllPropsJanus = usePropsCallingJanus(state => state.deleteAll)
        const deleteTime = useCallJanus(state => state.deleteTime)
        const { state, out, } = useAuth(state => ({
                state: state.state,
                out: state.out,
        }), shallow)

        const Routers: Record<TAuthContext, ReactNode> = {
                Gates: <GatesComponent />,
                SignIn: <SignInComponent />,
                Main: children,
        }

        async function signOut(): Promise<any> {
                return getReset()
                        .finally(() => {
                                deleteAllPropsJanus()
                                deleteTime()
                                if (out) out()
                        })
        }

        const ShowComponent = Routers[state || "Gates"]

        return (
                <AuthorizationContext.Provider value={{ signOut: signOut, }}>
                        {ShowComponent}
                </AuthorizationContext.Provider>
        )
}