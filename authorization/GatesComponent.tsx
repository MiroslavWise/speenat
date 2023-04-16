import { FC, useEffect } from "react";

import { Spin } from "antd";

import Loader from "@loader-spin";

import { useAuth } from "context/Authorization";


const GatesComponent: FC = () => {
        const { setAuthState, signOut } = useAuth()

        const tryToAuth = async (api?: () => Promise<any>) => {
                setAuthState("sign-in")
                // try {
                //         // await api()
                //         return setAuthState("sign-in")
                // } catch (e) {
                //         return setAuthState("sign-in")
                // }
        }

        useEffect(() => {
                tryToAuth()
        }, [])

        return <Spin></Spin>
}

export default GatesComponent