import { FC } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import { useTranslation } from "react-i18next"

import { Button } from "antd"

import CalendarEvent from "@icons-calendar-event"
import CurrentLocation from "@icons-current-location"
import Wallet from "@icons-wallet"
import Envelope from "@icons-envelope"
import MaleSign from "@icons-male-sign"
import FemaleSign from "@icons-female-sign"
import Phone from "@icons-phone"

import { useUser } from "store/use-user"
import { useAuth } from "context/Authorization"
import { changeNumber } from "functions/change-number"

const ItemsData: FC = () => {
        const { t } = useTranslation()
        const { push } = useRouter()
        const { signOut } = useAuth()
        const user = useUser(state => state.user)
        const isStaff = useUser(state => state.is_staff)

        const handleChange = () => push('/profile/change', undefined, { shallow: true })
        const handlePageInvite = () => push('/invited', undefined)
        const handlePageStaff = () => push('/analytics', undefined)
        const handlePageAccountant = () => push(`/accountant`, undefined)

        return (
                <>
                        <div className="item-data-small">
                                <div className="circle-image">
                                        <Envelope size={18} />
                                </div>
                                <p>{user?.profile?.user?.email}</p>
                        </div>
                        <div className="item-data-small">
                                <div className="circle-image">
                                        <CurrentLocation size={18} />
                                </div>
                                <p>{user?.profile?.address || "No adress"}</p>
                        </div>
                        <div className="item-data-small">
                                <div className="circle-image">
                                        <Wallet size={18} />
                                </div>
                                <p>{Number(user?.profile?.balance?.current_balance)?.toFixed(2)}</p>
                        </div>
                        {
                                user?.profile?.gender === "male"
                                        ? (
                                                <div className="item-data-small">
                                                        <div className="circle-image">
                                                                <MaleSign size={18} />
                                                        </div>
                                                        <p>{user?.profile?.gender_display}</p>
                                                </div>
                                        )
                                        : user?.profile?.gender === "female"
                                                ? (
                                                        <div className="item-data-small">
                                                                <div className="circle-image">
                                                                        <FemaleSign size={18} />
                                                                </div>
                                                                <p>{user?.profile?.gender_display}</p>
                                                        </div>
                                                )
                                                : null
                        }
                        {
                                user?.profile?.phone
                                        ? (
                                                <div className="item-data-small">
                                                        <div className="circle-image">
                                                                <Phone size={18} />
                                                        </div>
                                                        <p>{user?.profile?.phone ? changeNumber(user?.profile?.phone.toString()!) : ""}</p>
                                                </div>
                                        ) : null
                        }
                        <div className="buttons">
                                <Button
                                        className="login-submit"
                                        onClick={handleChange}
                                >
                                        <p>{t("Edit")}</p>
                                </Button>
                                <Button
                                        className="state-revers"
                                        onClick={() => {
                                                signOut()
                                                push(`/`)
                                        }}
                                >
                                        <p>{t("Exit")}</p>
                                </Button>
                        </div>
                </>
        )
}

export default ItemsData