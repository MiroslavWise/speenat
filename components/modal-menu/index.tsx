import { FC, MouseEvent, useCallback } from "react";
import { useRouter } from "next/router";

import { Switch } from "antd";

import type { TStatus } from "types/store/user";

import { useAuth } from "context/Authorization";
import { useModal } from "store/use-modal";
import { useUser } from "store/use-user";
import { updateStatus } from "api/api-status";

const objectStatus: Record<TStatus, [string, string]> = {
        online: ["В сети", "green"],
        offline: ["Не в сети", "gray"],
        busy: ["Занят", "red"],
}

const ModalMenu: FC = () => {
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
                event.defaultPrevented
                set(false)
        }

        const handleOut = (event: MouseEvent<HTMLDivElement>) => {
                event.preventDefault()
                event.stopPropagation()
                set(false)
                signOut()
        }

        const useStatus = useCallback(() => {
                if (isStatus && ["busy", "offline"]?.includes(isStatus)) {
                        updateStatus("online").finally(() => reloadUser(false))
                } else {
                        updateStatus("offline").finally(() => reloadUser(false))
                }
        }, [isStatus])

        return (
                <div
                        className={`modal-dots ${active && "active"}`}
                        onClick={handleUnActive}
                >
                        <div className={`container-modal ${active && "active"}`}>
                                <div className="elements">
                                        <div className="list">
                                                {
                                                        isSpeaker ? (
                                                                <div className="list-item status">
                                                                        <p>Статус: </p>
                                                                        {
                                                                                isStatus && objectStatus.hasOwnProperty(isStatus) ? (
                                                                                        <p style={{ color: objectStatus[isStatus][1] }}>{objectStatus[isStatus][0]}</p>
                                                                                ) : null
                                                                        }
                                                                        {
                                                                                isStatus && objectStatus.hasOwnProperty(isStatus) ? (
                                                                                        <Switch onChange={useStatus} defaultChecked={isStatus === "online" ? true : false} />
                                                                                ) : null
                                                                        }
                                                                </div>
                                                        ) : null
                                                }
                                                <div className="list-item" onClick={() => { push('/invited', undefined, { shallow: true }) }}><p>Пригласить друга</p></div>
                                                {
                                                        isStaff ? (
                                                                <div className="list-item" onClick={() => { push('/analytics', undefined, { shallow: true }) }}><p>Аналитика</p></div>
                                                        ) : null
                                                }
                                                {
                                                        isStaff ? (
                                                                <div className="list-item" onClick={() => { push('/accountant', undefined, { shallow: true }) }}><p>Кабинет бухгалтера</p></div>
                                                        ) : null
                                                }
                                        </div>
                                        <div className="menu-actions">
                                                Меню действий
                                        </div>
                                        <div
                                                onClick={handleUnActive}
                                                className="close-button"
                                        />
                                        <div
                                                className="state-revers modal-button"
                                                onClick={handleOut}
                                        >
                                                <p>Выйти</p>
                                        </div>
                                </div>
                        </div>
                </div>
        )
}

export default ModalMenu