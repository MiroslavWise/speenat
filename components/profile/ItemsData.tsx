import { FC } from "react";
import { useRouter } from "next/router";
import moment from "moment";

import { Button } from "antd";

import CalendarEvent from "@icons-calendar-event";
import CurrentLocation from "@icons-current-location";
import Wallet from "@icons-wallet";
import Envelope from "@icons-envelope";
import MaleSign from "@icons-male-sign";
import FemaleSign from "@icons-female-sign";
import Phone from "@icons-phone";

import { useUser } from "store/use-user";
import { useAuth } from "context/Authorization";


const ItemsData: FC = () => {
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
                                        <CurrentLocation size={18} />
                                </div>
                                <p>{ user?.profile?.address || "No adress" }</p>
                        </div>
                        <div className="item-data-small">
                                <div className="circle-image">
                                        <CalendarEvent size={18} />
                                </div>
                                <p>{ user?.profile?.birthday ? moment(user?.profile?.birthday).fromNow(true) : "No data birthday" }</p>
                        </div>
                        <div className="item-data-small">
                                <div className="circle-image">
                                        <Wallet size={18} />
                                </div>
                                <p>{ Number(user?.profile?.balance?.current_balance)?.toFixed(2)}</p>
                        </div>
                        <div className="item-data-small">
                                <div className="circle-image">
                                        <Envelope size={18} />
                                </div>
                                <p>{ user?.profile?.user?.email }</p>
                        </div>
                        {
                                user?.profile?.gender === "male"
                                        ? (
                                                <div className="item-data-small">
                                                        <div className="circle-image">
                                                                <MaleSign size={18} />
                                                        </div>
                                                        <p>{ user?.profile?.gender_display }</p>
                                                </div>
                                        )
                                        : user?.profile?.gender === "female"
                                                ? (
                                                        <div className="item-data-small">
                                                                <div className="circle-image">
                                                                        <FemaleSign size={18} />
                                                                </div>
                                                                <p>{ user?.profile?.gender_display }</p>
                                                        </div>
                                                )
                                                : null
                        }
                        <div className="item-data-small">
                                <div className="circle-image">
                                        <Phone size={18} />
                                </div>
                                <p>{ user?.profile?.phone }</p>
                        </div>
                        <div className="buttons">
                                <Button
                                        className="login-submit"
                                        onClick={handlePageInvite}
                                >
                                        <p>Пригласить друга</p>
                                </Button>
                                {
                                        isStaff
                                                ? (
                                                        <Button
                                                                className="login-submit"
                                                                onClick={handlePageStaff}
                                                        >
                                                                <p>Аналитика</p>
                                                        </Button>
                                        ) : null
                                }
                                                                {
                                        isStaff
                                                ? (
                                                        <Button
                                                                className="login-submit"
                                                                onClick={handlePageAccountant}
                                                        >
                                                                <p>Кабинет бухгалтера</p>
                                                        </Button>
                                        ) : null
                                }
                                <Button
                                        className="login-submit"
                                        onClick={handleChange}
                                >
                                        <p>Редактировать</p>
                                </Button>
                                <Button
                                        className="state-revers"
                                        onClick={signOut}
                                >
                                        <p>Выйти</p>
                                </Button>
                        </div>

                </>
        )
}

export default ItemsData