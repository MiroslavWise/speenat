import { FC, ReactNode, createContext, useContext, useEffect, useState } from "react";

import type { TAuthStateType, IAuthContext } from "types/auth";

import GatesComponent from "authorization/GatesComponent";
import SignInComponent from "authorization/SignInComponent";

import userData from "helpers/user-data";
import { useUser } from "store/use-user";

const AuthorizationContext = createContext<IAuthContext | undefined>(undefined)

const Authorization: FC<{ children: ReactNode }> = ({ children }) => {
        const [authState, setAuthState] = useState<TAuthStateType>("gates")
        const getReset = useUser(state => state.getReset)

        const Routers: Record<TAuthStateType, ReactNode> = {
                "gates": <GatesComponent />,
                "sign-in": <SignInComponent />,
                "main": children,
        }

        function signOut() {
                setAuthState("sign-in")
                userData.delete()
                getReset()
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