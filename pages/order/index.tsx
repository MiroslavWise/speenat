import dayjs from "dayjs"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"
import { useWeb } from "context/WebSocketContext"
import { TStatusAmount, apiOrder, apiOrderList } from "api/api-order"
import styles from "./style.module.scss"
import { profileMy } from "api/api-user"
import { useAuth } from "store/use-auth"
import { useTranslation } from "react-i18next"

const svg: Record<TStatusAmount, string> = {
    charged: "/svg/order/credit-card-check.svg",
    rejected: "/svg/order/credit-card-x.svg",
    new: "/svg/order/credit-card-download.svg",
    declined: "/svg/order/shield-zap.svg",
    fraud: "/svg/order/shield-dollar.svg",
    validation: "/svg/order/credit-card-lock.svg",
    error: "/svg/order/brackets-x.svg",
}

export default function Order() {
    const { query, push } = useRouter()
    const token = useAuth(({ token }) => token)
    const [page, setPage] = useState(1)

    const { t } = useTranslation()
    const orderId = useMemo(() => {
        if (!query["order-id"]) {
            return null
        }
        if (query["order-id"]) {
            const id = query["order-id"]?.toString()?.split("&order-id=")?.[0]!

            return id
        }
    }, [query["order-id"]])

    const getTransactionTypes = () => {
        return [
            {
                img: svg.charged,
                label: t("Successful funds transfer"),
            },
            {
                img: svg.new,
                label: t("Transaction in progress (transaction not completed)"),
            },
            {
                img: svg.rejected,
                label: t("Transaction rejected by the gateway"),
            },
            {
                img: svg.validation,
                label: t("Request not processed due to validation failure"),
            },
            {
                img: svg.fraud,
                label: t("Transaction declined by the fraud protection system in the gateway"),
            },
            {
                img: svg.declined,
                label: t("Acquirer declined the transaction"),
            },
            {
                img: svg.error,
                label: t("Rejection due to error on the acquirer or gateway side"),
            },
        ]
    }

    const TYPES_TRANSACTIONS = getTransactionTypes()

    const { data: dataProfile } = useQuery({
        queryFn: () => profileMy(),
        queryKey: ["profile-me", token!],
        enabled: !!token,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    const { data } = useQuery({
        queryFn: () => apiOrderList(page),
        queryKey: ["order", "list", `page=${page}`],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (dataProfile?.profile && orderId) {
            if (dataProfile?.profile?.user?.is_speaker) {
                push(`/archive?order-id=${orderId}`, undefined)
            } else if (dataProfile?.profile?.user?.is_speaker === false) {
                push(`/teachers?order-id=${orderId}`, undefined)
            }
        }
    }, [dataProfile, orderId])

    const list = useMemo(() => {
        return data?.data?.results || []
    }, [data?.data])
    return (
        <div className={styles.wrapper}>
            <h3>{t("Statistics on your cash flows")}</h3>
            <div data-icons>
                <section>
                    <div data-img>
                        <img src="/svg/order/coins-stacked-01.svg" alt="coins-stacked" width={24} height={24} />
                    </div>
                    <p>
                        {t("Current balance")}:{" "}
                        <span>{Number(dataProfile?.profile?.balance?.current_balance || 0)}₸</span>
                    </p>
                </section>
            </div>
            <div data-icons>
                {TYPES_TRANSACTIONS.map((item) => (
                    <section key={`${item.img}:${item.label.replace(" ", "-")}`}>
                        <div data-img>
                            <img src={item.img} alt={item.img} width={24} height={24} />
                        </div>
                        <p>{item.label}</p>
                    </section>
                ))}
            </div>
            <h5>{t("Transactions")}</h5>
            <ul>
                {list.map((item) => (
                    <li key={`${item.id}-amount`}>
                        <div data-icon>
                            <img src={svg[item.status!]} alt="amount" width={24} height={24} />
                        </div>
                        <div data-info>
                            <h4>
                                {t("Sum")}: <span>{Number(item.amount).toFixed(0)}₸</span>
                            </h4>
                            {item.updated_at ? (
                                <h4>
                                    {t("Date and time")}:{" "}
                                    <span>{dayjs(item.updated_at).format("HH:mm DD.MM.YYYY")}</span>
                                </h4>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
