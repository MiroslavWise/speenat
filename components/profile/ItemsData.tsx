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
import { changeNumber } from "functions/change-number"
import { useAuth } from "store/use-auth"
import { updateStatus } from "api/api-status"

const ItemsData: FC = () => {
        const { t } = useTranslation()
        const { push } = useRouter()
        const out = useAuth(state => state.out)
        const user = useUser(state => state.user)
        const isStaff = useUser(state => state.is_staff)
        
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
                </>
        )
}

export default ItemsData