import { FC, MouseEvent, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { useAuth } from "context/Authorization";
import { useModal } from "store/use-modal";
import { useUser } from "store/use-user";
import LanguageButtons from "./Language";

const ModalMenu: FC = () => {
        const { t } = useTranslation()
        const { push } = useRouter()
        const { signOut } = useAuth()
        const active = useModal(state => state.active)
        const set = useModal(state => state.setActive)
        const isStaff = useUser(state => state.is_staff)
        const isStatus = useUser(state => state.user?.profile?.status)
        const isSpeaker = useUser(state => state.is_speaker)
        const reloadUser = useUser(state => state.getUserData)

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
                signOut()
                        .finally(() => {
                                push('/')
                        })
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
                                                {
                                                        isStaff ? (
                                                                <div className="list-item" onClick={() => { push('/accountant', undefined, { shallow: true }) }}><p>{t("Accountant_office")}</p></div>
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