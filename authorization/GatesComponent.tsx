import { FC, useEffect } from "react"

import { Spin } from "antd"

import userData from "helpers/user-data"
import refreshData from "helpers/refresh-data"

import { useAuth } from "context/Authorization"


const GatesComponent: FC = () => {
    const { setAuthState, signOut } = useAuth()

    const tryToAuth = async (api: () => void) => {
        try {
            api();
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
                refreshData.finishRefresh();
                await tryToAuth(() => refreshData.refresh());
            }
        } else {
            signOut();
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return <Spin size="large" spinning style={{ height: "100vh", width: "100vw", display: 'grid', justifyContent: 'center', alignItems: 'center' }} />
}

export default GatesComponent