import { FC, useCallback, useEffect } from "react"
import { isMobile } from "react-device-detect"
import LeftArrow from "./components/header/LeftArrow"
import NameCategory from "./components/header/NameCategory"
import MenuDots from "./components/header/RightMenuDots"
import { shallow } from "zustand/shallow"
import { useUser } from "store/use-user"
import { Switch } from "antd/lib"
import { useTranslation } from "react-i18next"
import { TStatus } from "types/store/user"
import { updateStatus } from "api/api-status"
import styles from "./styles/header.module.scss"
import usePlaySound from "hooks/usePlaySound"

const objectStatus = (t: (value: string) => string): Record<TStatus, [string, string]> => ({
    online: [t("Online"), "green"],
    offline: [t("Offline"), "red"],
    busy: [t("Busy"), "red"],
})

const Header: FC = () => {
    const { t } = useTranslation()
    const isSpeaker = useUser(({ is_speaker }) => is_speaker)
    const user = useUser(({ user }) => user)
    const reloadUser = useUser(({ getUserData }) => getUserData)
    const { profile } = user ?? {}
    const { status: isStatus } = profile ?? {}

    const { playSoundSwitchStatus } = usePlaySound()

    const useStatus = useCallback(() => {
        if (isStatus && ["busy", "offline"]?.includes(isStatus)) {
            updateStatus("online").finally(() => {
                playSoundSwitchStatus()
                reloadUser(false)
            })
        } else {
            updateStatus("offline").finally(() => reloadUser(false))
        }
    }, [isStatus])

    useEffect(() => {
        isStatus
    }, [])

    return isMobile ? (
        <header className={styles.wrapperHeader}>
            {isSpeaker ? (
                <div className="list-item status" style={{ background: "transparent" }}>
                    <p>{t("Status")}: </p>
                    {isStatus && objectStatus(t).hasOwnProperty(isStatus) ? (
                        <p style={{ color: objectStatus(t)[isStatus][1] }}>{objectStatus(t)[isStatus][0]}</p>
                    ) : null}
                    {isStatus && objectStatus(t).hasOwnProperty(isStatus) ? (
                        <Switch onChange={useStatus} checked={isStatus === "online"} />
                    ) : null}
                </div>
            ) : null}
            <section>
                <LeftArrow />
                <NameCategory />
                <MenuDots />
            </section>
        </header>
    ) : null
}

export default Header
