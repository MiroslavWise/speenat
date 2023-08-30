import { FC } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "react-i18next";

import { useUser } from "store/use-user";
import { useAuth } from "store/use-auth";

export const ItemsData: FC = () => {
    const { t } = useTranslation()
    const { push } = useRouter()
    const out = useAuth((state) => state.out)
    const user = useUser((state) => state.user)
    const isStaff = useUser((state) => state?.user?.profile?.is_accountant)
    const handlePageInvite = () => push("/invited", undefined)
    const handlePageStaff = () => push("/analytics", undefined)
    const handlePageAccountant = () => push(`/accountant`, undefined)

    // {
    //     label: "Invite_a_friend",
    //     path: "/invited",
    //     icon: "/svg/terms/attachment.svg",
    // },

    return (
        <>
            <li>
                <div className="icon">
                    <Image
                        src="/svg/terms/mail.svg"
                        alt="wallet"
                        width={18}
                        height={18}
                    />
                </div>
                <p>{user?.profile?.user?.email}</p>
            </li>
            <li>
                <div className="icon">
                    <Image
                        src="/svg/terms/wallet.svg"
                        alt="wallet"
                        width={18}
                        height={18}
                    />
                </div>
                <p>
                    {Number(user?.profile?.balance?.current_balance)?.toFixed(
                        2,
                    )}
                </p>
            </li>
            {
                isStaff ? (
                    <li onClick={() => push("/analytics")}>
                        <div className="icon">
                            <Image
                                src="/svg/terms/bar-chart.svg"
                                alt="bar-chart"
                                width={18}
                                height={18}
                            />
                        </div>
                        <p>{t("Accountant_office")}</p>
                    </li>
                ) : null
            }
            <li onClick={() => { push("/invited", undefined, { shallow: true }) }}>
                <div className="icon">
                    <Image
                        src="/svg/terms/attachment.svg"
                        alt="wallet"
                        width={18}
                        height={18}
                    />
                </div>
                <p>{t("Invite_a_friend")}</p>
            </li>
        </>
    )
}
