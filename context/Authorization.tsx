import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";

import type { TAuthStateType, IAuthContext } from "types/auth";

import GatesComponent from "authorization/GatesComponent";
import SignInComponent from "authorization/SignInComponent";

const AuthorizationContext = createContext<IAuthContext | undefined>(undefined)

const Authorization: FC<{ children: ReactNode }> = ({ children }) => {
        const [authState, setAuthState] = useState<TAuthStateType>("gates")

        const Routers: Record<TAuthStateType, ReactNode> = {
                "gates": <GatesComponent />,
                "sign-in": <SignInComponent />,
                "main": children,
        }

        function signOut() {
                setAuthState("sign-in")
        }

        useEffect(() => {
                setAuthState("main")
        }, [])

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