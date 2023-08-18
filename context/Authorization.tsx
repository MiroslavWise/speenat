import { type FC, type ReactNode, createContext, useContext, useState } from "react";

import type { TAuthStateType, IAuthContext } from "types/auth";

import GatesComponent from "authorization/GatesComponent";
import SignInComponent from "authorization/SignInComponent";

import { useUser } from "store/use-user";
import userData from "helpers/user-data";
import { useCallJanus, usePropsCallingJanus } from "store/use-call-janus";

const AuthorizationContext = createContext<IAuthContext | undefined>(undefined)

const Authorization: FC<{ children: ReactNode }> = ({ children }) => {
        const [authState, setAuthState] = useState<TAuthStateType>("gates")
        const getReset = useUser(state => state.getReset)
        const deleteAllPropsJanus = usePropsCallingJanus(state => state.deleteAll)
        const deleteTime = useCallJanus(state => state.deleteTime)

        const Routers: Record<TAuthStateType, ReactNode> = {
                "gates": <GatesComponent />,
                "sign-in": <SignInComponent />,
                "main": children,
        }

        async function signOut(): Promise<any> {
                return getReset()
                        .finally(() => {
                                deleteAllPropsJanus()
                                deleteTime()
                                userData.delete()
                                setAuthState("sign-in")
                        })
        }

        const ShowComponent = Routers[authState]

        return (
                <AuthorizationContext.Provider
                        value={{
                                authState: authState,
                                setAuthState: setAuthState,
                                signOut: signOut,
                        }}
                >
                        {ShowComponent}
                </AuthorizationContext.Provider>
        )
}

const useAuth = () => {
        const context = useContext(AuthorizationContext)

        if (context === undefined)  throw new Error('useAuth must be used within a Authorization Provider')

        return context
}

export {
        AuthorizationContext,
        Authorization,
        useAuth,
}