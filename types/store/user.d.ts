import { Dispatch, DispatchWithoutAction } from "react"




export interface IUser{

}

export interface IUserStore{
        user: undefined | IUser
        loading: boolean

        getUserData: DispatchWithoutAction
}