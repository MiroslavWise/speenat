import { FC, useEffect } from "react"

import { Spin } from "antd"

import userData from "helpers/user-data"
import refreshData from "helpers/refresh-data"

import { useAuth } from "context/Authorization"


const GatesComponent: FC = () => {
        const { setAuthState, signOut } = useAuth()

        const tryToAuth = async (api: any) => {
                try {
                        await api()
                        return setAuthState("main");
                } catch (e) {
                        return setAuthState("sign-in");
                }
        };
        const checkAuth = async () => {
                if (userData.isUserOk) {
                        const isTokenOk = await userData.isTokenOk();
                        if (!refreshData.isNeedToRefresh && isTokenOk) {
                                setAuthState("main");
                        } else {
                                await tryToAuth(() => refreshData.refresh())
                                        .finally(() => {
                                                refreshData.finishRefresh()
                                        })
                        }
                } else {
                        signOut();
                }
        }
        useEffect(() => { checkAuth() }, [])

        return <Spin size="large" spinning style={{ height: "100vh", width: "100vw", display: 'grid', justifyContent: 'center', alignItems: 'center' }} />
}

export default GatesComponent