import { apiPostReferralLinkBuy, apiReferralPrice } from "api/api-referral"
import { useVisibleModalReferral } from "store/use-visible-modal-referral"

import styles from "./style.module.scss"
import { useQuery } from "react-query"
import { profileMy } from "api/api-user"
import { useAuth } from "store/use-auth"

export const ModalReferral = () => {
    const text = useVisibleModalReferral(({ text }) => text)
    const token = useAuth(({ token }) => token)
    const visible = useVisibleModalReferral(({ visible }) => visible)
    const dispatchVisibleReferral = useVisibleModalReferral(({ dispatchVisibleReferral }) => dispatchVisibleReferral)

    const { refetch } = useQuery({
        queryFn: () => profileMy(),
        queryKey: ["profile-me", token!],
        enabled: false,
    })
    const { refetch: refetchReferral } = useQuery({
        queryFn: () => apiReferralPrice(),
        queryKey: ["referral-price"],
        enabled: false,
    })

    function handle() {
        apiPostReferralLinkBuy()
            .then((response) => {
                if (!!response?.data?.id) {
                    refetch()
                    refetchReferral()
                }
            })
            .finally(() => {
                dispatchVisibleReferral({ visible: false })
            })
    }

    return (
        <div className={styles.wrapper} data-visible={visible}>
            <section>
                <div
                    data-close
                    onClick={() => {
                        dispatchVisibleReferral({ visible: false })
                    }}
                >
                    <img src="/svg/x-close.svg" alt="X" width={16} height={16} />
                </div>
                <h3>{text}</h3>
                <button className="button-default-primary" onClick={handle}>
                    <span>Купить</span>
                </button>
                <button
                    className="button-default-primary"
                    data-button-close
                    onClick={() => {
                        dispatchVisibleReferral({ visible: false })
                    }}
                >
                    <span>Отмена</span>
                </button>
            </section>
        </div>
    )
}
