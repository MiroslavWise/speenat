import { FC } from "react";

import { Spin } from "antd";

import Loader from "@loader-spin";

import { useAuth } from "context/Authorization";


const GatesComponent: FC = () => {
        const { setAuthState, signOut } = useAuth()

        const tryToAuth = async (api: () => Promise<any>) => {
                try {
                        await api()
                        return setAuthState("main")
                } catch (e) {
                        return setAuthState("sign-in")
                }
        }

        return (
                <Spin
                        style={{height: '100vh', width: '100%'}}
                        spinning
                        indicator={<Loader />}
                />
        )
}

export default GatesComponent