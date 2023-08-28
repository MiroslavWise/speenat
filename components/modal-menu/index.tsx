import { FC, MouseEvent, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { useModal } from "store/use-modal";
import { useUser } from "store/use-user";
import { useAuth } from "store/use-auth";
import LanguageButtons from "./Language";

const ModalMenu: FC = () => {
        const { t } = useTranslation()
        const { push } = useRouter()
        const user = useUser(state => state.user)
        const active = useModal(state => state.active)
        const set = useModal(state => state.setActive)
        const isStaff = useUser(state => state?.user?.profile?.is_accountant)
        const out = useAuth(state => state.out)

        console.log("user: ", user)

        const handleUnActive = (event: MouseEvent<HTMLDivElement>) => {
                event.preventDefault()
                event.stopPropagation()
                event.defaultPrevented = true
                set(false)
        }

        const handleOut = (event: MouseEvent<HTMLDivElement>) => {
                event.preventDefault()
                event.stopPropagation()
                set(false)
                if (out) out()
                push("/")
        }

        return (
                <div
                        className={`modal-dots ${active && "active"}`}
                        onClick={(e) => handleUnActive(e)}
                >
                        <div className={`container-modal ${active && "active"}`}>
                                <div className="elements">
                                        <div className="list">
                                                <div className="list-item" onClick={() => { push('/chat', undefined, { shallow: true }) }}><p>{t("Chat")}</p></div>
                                                <div className="list-item" onClick={() => { push('/invited', undefined, { shallow: true }) }}><p>{t("Invite_a_friend")}</p></div>
                                                {
                                                        isStaff ? (
                                                                <div className="list-item" onClick={() => { push('/analytics', undefined, { shallow: true }) }}><p>{t("Analytics")}</p></div>
                                                        ) : null
                                                }
                                        </div>
                                        <LanguageButtons />
                                        <div
                                                onClick={handleUnActive}
                                                className="close-button"
                                        />
                                        <div
                                                className="state-revers modal-button"
                                                onClick={handleOut}
                                        >
                                                <p>{t("Exit")}</p>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

export default ModalMenu