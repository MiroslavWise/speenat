import { Dispatch, SetStateAction } from "react"

export interface IAuthContext{
        signOut(): Promise<any>
}