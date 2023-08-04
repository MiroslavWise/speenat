import { Dispatch, SetStateAction } from "react"

export type TAuthStateType = "sign-in" | "main" | "gates"

export interface IAuthContext{
        authState: TAuthStateType

        setAuthState: Dispatch<SetStateAction<TAuthStateType>>
        signOut(): Promise<any>
}