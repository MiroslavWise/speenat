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


const ItemsData: FC = () => {
        const { push } = useRouter()
        const user = useUser(state => state.user)

        const handleChange = () => {
                push('/profile/change', undefined, { shallow: true })
        }

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
                        <Button
                                className="login-submit w-100"
                                onClick={handleChange}
                        >
                                <p>Редактировать</p>
                        </Button>
                </>
        )
}

export default ItemsData