import { FC, useEffect } from "react"

import { Spin } from "antd"

import userData from "helpers/user-data"
import refreshData from "helpers/refresh-data"

import { useAuth } from "context/Authorization"


const GatesComponent: FC = () => {
    const { setAuthState, signOut } = useAuth()

    const tryToAuth = async (api: () => void) => {
        try {
            api()
            return setAuthState("main")
        } catch (e) {
            return setAuthState("sign-in")
        }
    };

    const checkAuth = async () => {
        if (userData.isUserOk) {
            const isTokenOk = await userData.isTokenOk()
            if (!refreshData.isNeedToRefresh && isTokenOk) {
                setAuthState("main")
            } else {
                refreshData.finishRefresh()
                await tryToAuth(() => refreshData.refresh())
            }
        } else {
            signOut()
        }
    }

    // useEffect(() => {
    //     const obj1 = { a: 1, b: 2, c: 3 };
    //     const obj2 = { a: 3, b: 7, c: 3 };
    //     const obj3 = { a: 3, b: 7, c: 4 };

    //     const func = (_obj1: any, _obj2: any): boolean => {
    //         for (const property in _obj1) {
    //             if (_obj1[property] === _obj2[property]) return true
    //         }
    //         return false
    //     }

    //     console.log(func(obj1, obj2));
    //     console.log(func(obj1, obj3));
    // }, [])

    useEffect(() => {
        checkAuth();
    }, [])

    return <Spin size="large" spinning style={{ height: "100vh", width: "100vw", display: 'grid', justifyContent: 'center', alignItems: 'center' }} />
}

export default GatesComponent