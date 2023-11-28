import { NextPage } from "next"
import { useMemo, useState } from "react"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"

import { Typography } from "antd/lib"

import { ButtonsSocial } from "components/invited/ButtonsSocial"

import { useQuery } from "react-query"
import { profileMy } from "api/api-user"
import { useAuth } from "store/use-auth"
import { useDocumentTitle } from "hooks/useDocumentTitle"
import { apiReferralPrice } from "api/api-referral"
import { useVisibleModalReferral } from "store/use-visible-modal-referral"

const Invited: NextPage = () => {
    const { push } = useRouter()
    const { t } = useTranslation()
    const dispatchVisibleReferral = useVisibleModalReferral(({ dispatchVisibleReferral }) => dispatchVisibleReferral)
    useDocumentTitle("Invitation")
    const token = useAuth(({ token }) => token)
    const [loading, setLoading] = useState(false)
    const { data, isLoading } = useQuery({
        queryFn: () => profileMy(),
        queryKey: ["profile-me", token!],
        enabled: !!token,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })
    const { data: dataReferral } = useQuery({
        queryFn: () => apiReferralPrice(),
        queryKey: ["referral-price"],
        enabled: !!data?.profile && data?.profile?.is_can_use_ref_code === false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        retry: false,
        refetchInterval: false,
    })

    const amountReferral = useMemo(() => {
        if (!!dataReferral?.data?.amount) {
            return Number(dataReferral?.data?.amount)
        }
        return null
    }, [dataReferral])

    const label = useMemo(() => {
        if (data?.profile?.is_can_use_ref_code === false && amountReferral) {
            if (amountReferral > Number(data?.profile?.balance?.current_balance)) {
                return `Пополнить (не хватает ${amountReferral - Number(data?.profile?.balance?.current_balance)})`
            } else if (amountReferral < Number(data?.profile?.balance?.current_balance)) {
                return `Купить (${amountReferral}₸)`
            }
        }
        return null
    }, [data, dataReferral])

    function handle() {
        if (!loading) {
            if (data?.profile?.is_can_use_ref_code === false && amountReferral) {
                if (amountReferral > Number(data?.profile?.balance?.current_balance)) {
                    setLoading(true)
                    push(`/pay-data`)
                } else if (amountReferral < Number(data?.profile?.balance?.current_balance)) {
                    dispatchVisibleReferral({
                        visible: true,
                        text: `Жедаете ли вы приобрести подписку на реферальную систему за ${amountReferral}₸`,
                    })
                }
            }
        }
    }

    if (isLoading) return null

    return (
        <div className="wrapper invited">
            {data?.profile?.is_can_use_ref_code ? (
                <div className="link-invited">
                    <p>{t("Your invitation link")}: </p>
                    <Typography.Paragraph
                        copyable={{
                            text: `${data?.profile?.user?.full_name} ${
                                data?.profile?.gender === "female"
                                    ? t("invited you to the Spenat service -female")
                                    : t("invited you to the Spenat service -male")
                            } https://${process.env.NEXT_PUBLIC_FRONTEND}/?referral_code=${data?.profile
                                ?.referral_code}`,
                        }}
                        className="link"
                    >
                        {data?.profile?.referral_code}
                    </Typography.Paragraph>
                    <ButtonsSocial />
                </div>
            ) : (
                <div className="link-invited-false">
                    <h3>
                        У вас нет ссылки на реферальную системы. Если вы хотите пригласить друзей и вместе и ними
                        учавствовать в нашей программе, вы можете купить доступ к ней
                    </h3>
                    {label ? (
                        <button className="button-default-primary" onClick={handle}>
                            <span>{label}</span>
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default Invited
