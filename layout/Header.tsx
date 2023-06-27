import { FC, useCallback } from "react"
import { isMobile } from "react-device-detect"
import LeftArrow from "./components/header/LeftArrow"
import NameCategory from "./components/header/NameCategory"
import MenuDots from "./components/header/RightMenuDots"
import { shallow } from "zustand/shallow"
import { useUser } from "store/use-user"
import { Switch } from "antd"
import { useTranslation } from "react-i18next"
import { TStatus } from "types/store/user"
import { updateStatus } from "api/api-status"



const objectStatus: Record<TStatus, [string, string]> = {
        online: ["В сети", "green"],
        offline: ["Не в сети", "red"],
        busy: ["Занят", "red"],
}

const Header: FC = () => {
        const { t } = useTranslation()
        const { getUser, loading, isSpeaker, isStatus, reloadUser } = useUser(state => ({
                getUser: state.getUserData,
                loading: state.loading,
                isSpeaker: state.is_speaker,
                isStatus: state?.user?.profile?.status,
                reloadUser: state.getUserData,
        }), shallow) ?? {}

        const useStatus = useCallback(() => {
                if (isStatus && ["busy", "offline"]?.includes(isStatus)) {
                        updateStatus("online").finally(() => reloadUser(false))
                } else {
                        updateStatus("offline").finally(() => reloadUser(false))
                }
        }, [isStatus])

        return (
                isMobile
                        ? (
                                <header className="header">
                                        {
                                                isSpeaker ? (
                                                        <div className="list-item status" style={{ background: 'transparent' }}>
                                                                <p>{t("Status")}: </p>
                                                                {
                                                                        isStatus && objectStatus.hasOwnProperty(isStatus) ? (
                                                                                <p style={{ color: objectStatus[isStatus][1] }}>{objectStatus[isStatus][0]}</p>
                                                                        ) : null
                                                                }
                                                                {
                                                                        isStatus && objectStatus.hasOwnProperty(isStatus) ? (
                                                                                <Switch
                                                                                        onChange={useStatus}
                                                                                        defaultChecked={isStatus === "online" ? true : false} />
                                                                        ) : null
                                                                }
                                                        </div>
                                                ) : null
                                        }
                                        <section>
                                                <LeftArrow />
                                                <NameCategory />
                                                <MenuDots />
                                        </section>
                                </header>
                        ) : null
        )
}

export default Header