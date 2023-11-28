import { useEffect, useMemo } from "react"
import { useQuery } from "react-query"
import { useRouter } from "next/router"

import { apiOrder } from "api/api-order"
import { useAuth } from "store/use-auth"
import { useWeb } from "context/WebSocketContext"

import styles from "./style.module.scss"

export const OrderId = () => {
    const { query, replace } = useRouter()
    const token = useAuth(({ token }) => token)
    const { wsChannel } = useWeb()

    const orderId = useMemo(() => {
        const id = query["order-id"]
        if (!id) {
            return null
        }
        if (id) {
            return id as string
        }

        return null
    }, [query["order-id"]])

    const { data, isLoading, refetch } = useQuery({
        queryFn: () => apiOrder(orderId!),
        queryKey: ["order", orderId],
        enabled: !!orderId && !!token,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (wsChannel) {
            wsChannel.addEventListener("message", eventMessage)
        }
        return () => wsChannel?.removeEventListener("message", eventMessage)
    }, [wsChannel])

    function eventMessage(event: any) {
        const data = JSON.parse(event.data).data
        if (data?.type === "billing_deposit_up") {
            refetch()
        }
        if (data?.type === "billing_declined") {
            refetch()
        }
    }

    const status = useMemo(() => {
        if (!data?.data) {
            return null
        }

        const status = data?.data?.status

        return status
    }, [data?.data?.status])

    useEffect(() => {
        if (status) {
            if (["charged", "declined", "fraud", "rejected", "error", "validation"].includes(status)) {
                const timeOut = setTimeout(() => {
                    replace(`/teachers`, undefined)
                }, 7 * 1000)

                return () => clearTimeout(timeOut)
            }
        }
    }, [status])

    if (isLoading) return null

    return (
        <div className={styles.container} data-status={status}>
            <p>
                {status === "charged"
                    ? "Платёж поступил, и вы можете воспользоваться услугами консультации!"
                    : status === "new"
                      ? "Идёт транзакция поступления средств на ваш счёт. Это может занять несколько минут, и вы получите уведомление о поступлении средств!"
                      : status === "validation"
                        ? "Транзакция не прошла валидацию. Повторите операцию через несколько минут"
                        : status === "error"
                          ? "Произошла какая-то ошибка платежа. Наш сервис разбирается в ней. Попробуйте, пожалуйста, чуть позже"
                          : status === "declined"
                            ? "Транзакция была отклонена по неизвестным нам причинам"
                            : null}
            </p>
        </div>
    )
}
