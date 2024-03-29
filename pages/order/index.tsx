import dayjs from "dayjs"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import { useEffect, useMemo, useState } from "react"

import { useWeb } from "context/WebSocketContext"
import { TStatusAmount, apiOrder, apiOrderList } from "api/api-order"

import styles from "./style.module.scss"
import { profileMy } from "api/api-user"
import { useAuth } from "store/use-auth"

const svg: Record<TStatusAmount, string> = {
    charged: "/svg/order/credit-card-check.svg",
    rejected: "/svg/order/credit-card-x.svg",
    new: "/svg/order/credit-card-download.svg",
    declined: "/svg/order/shield-zap.svg",
    fraud: "/svg/order/shield-dollar.svg",
    validation: "/svg/order/credit-card-lock.svg",
    error: "/svg/order/brackets-x.svg",
}

const TYPES_TRANSACTIONS: { img: string; label: string }[] = [
    {
        img: svg.charged,
        label: "Успешное зачисление средст",
    },
    {
        img: svg.new,
        label: "Идёт исполнение транзакции (транзация не закончилась)",
    },
    {
        img: svg.rejected,
        label: "Транзакция отклонена шлюзом",
    },
    {
        img: svg.validation,
        label: "Запрос не обработан, т.к. не прошел валидацию",
    },
    {
        img: svg.fraud,
        label: "Транзакция отклонена системой защиты от мошеннических транзакций в шлюзе",
    },
    {
        img: svg.declined,
        label: "Эквайер отклонил транзакцию",
    },
    {
        img: svg.error,
        label: "Отказ из-за ошибки на стороне эквайера или шлюза",
    },
]

export default function Oder() {
    const { query, push } = useRouter()
    const token = useAuth(({ token }) => token)
    const [page, setPage] = useState(1)

    const orderId = useMemo(() => {
        if (!query["order-id"]) {
            return null
        }
        if (query["order-id"]) {
            const id = query["order-id"]?.toString()?.split("&order-id=")?.[0]!

            return id
        }
    }, [query["order-id"]])

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
            <h3>Статистика движений ваших денежных средств</h3>
            <div data-icons>
                <section>
                    <div data-img>
                        <img src="/svg/order/coins-stacked-01.svg" alt="coins-stacked" width={24} height={24} />
                    </div>
                    <p>
                        Текущий баланс: <span>{Number(dataProfile?.profile?.balance?.current_balance || 0)}₸</span>
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
            <h5>Транзакции</h5>
            <ul>
                {list.map((item) => (
                    <li key={`${item.id}-amount`}>
                        <div data-icon>
                            <img src={svg[item.status!]} alt="amount" width={24} height={24} />
                        </div>
                        <div data-info>
                            <h4>
                                Сумма: <span>{Number(item.amount).toFixed(0)}₸</span>
                            </h4>
                            {item.updated_at ? (
                                <h4>
                                    Дата и время: <span>{dayjs(item.updated_at).format("HH:mm DD.MM.YYYY")}</span>
                                </h4>
                            ) : null}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
