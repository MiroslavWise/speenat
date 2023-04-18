import { DispatchWithoutAction } from "react";

interface Login {
        email?: string;
        password?: string;
        curRefreshToken?: string;
        isRefresh?: boolean;
}

export interface IUserData{
        async login({ email, password, curRefreshToken, isRefresh }: Login): Promise<any>
        startLogin: DispatchWithoutAction
        finisLogin: DispatchWithoutAction
        delete: DispatchWithoutAction
        signOut: DispatchWithoutAction
        async isTokenOk(): Promise<any>

        get isLogging(): boolean
        get JWT(): string
        get refreshToken(): string
        get tokenExp(): string
        get jwtData(): object
        get isUserOk(): boolean

}

export interface IRefreshData{
        async waitForRefreshToken(): Promise<boolean>
        async refresh: DispatchWithoutAction

        startRefresh: DispatchWithoutAction
        finishRefresh: DispatchWithoutAction

        get isRefreshing(): boolean
        get isNeedToRefresh(): any

}