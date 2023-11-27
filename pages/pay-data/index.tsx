import { useState } from "react"
import { NextPage } from "next"
import { useTranslation } from "react-i18next"
import { Button, Form, InputNumber } from "antd"
import { useForm } from "react-hook-form"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useUser } from "store/use-user"

import { apiCreateOrder } from "api/api-order"
import { useQuery } from "react-query"
import { profileMy } from "api/api-user"

interface IValues {
    incom: number
}

const PayData: NextPage = () => {
    useDocumentTitle("Online_payments")
    const { t } = useTranslation()
    const isSpeaker = useUser(({ is_speaker }) => is_speaker)
    const user = useUser(({ user }) => user)
    const [form] = Form.useForm<IValues>()
    const { register, handleSubmit } = useForm<IValues>({
        defaultValues: {
            incom: 51,
        },
    })
    const [loading, setLoading] = useState(false)

    const { data, isLoading } = useQuery({
        queryFn: () => profileMy(),
        queryKey: ["profile-me", user?.profile?.user?.id!],
        enabled: !!user?.profile?.user?.id,
        refetchOnMount: false,
        refetchOnReconnect: true,
    })

    const onOutMoney = (values: { incom: number }) => {}

    const onInMoney = (values: IValues) => {
        if (!loading) {
            setLoading(true)
            if (values?.["incom"]) {
                apiCreateOrder({ amount: values["incom"] })
                    .then((response) => {
                        if (response) {
                            console.log("values: ", response)
                            document.location.href = response?.data?.payment_order_url
                        }
                    })
                    .catch((error) => {
                        console.log("error:", error)
                    })
                    .finally(() => {
                        setLoading(false)
                    })
            }
        }
    }

    const onSubmit = handleSubmit(onInMoney)

    if (isLoading) return null

    return (
        <div className="content-archive">
            {isSpeaker ? (
                <Form
                    onFinish={onOutMoney}
                    className="list-archive form"
                    initialValues={{
                        "money-out": 250,
                    }}
                >
                    <div className="item-money">
                        <p className="title">{t("Withdrawal of money")}</p>
                        <div className="item-form">
                            <p>{t("Specify the withdrawal amount (the minimum withdrawal amount is 250₸)")}</p>
                            <Form.Item name="money-out">
                                <InputNumber
                                    min={250}
                                    type="number"
                                    prefix="₸"
                                    style={{
                                        margin: 0,
                                        borderColor: "var( --gray-color)",
                                    }}
                                />
                            </Form.Item>
                        </div>
                        <div className="item-form">
                            <Button className="login-submit" htmlType="submit">
                                <p>{t("Withdraw money")}</p>
                            </Button>
                        </div>
                    </div>
                </Form>
            ) : (
                <form onSubmit={onSubmit} className="list-archive form">
                    <div className="item-money">
                        <p className="title">{t("Top up your balance")}</p>
                        <div className="item-form">
                            <p>
                                {t("Specify the deposit amount (the minimum deposit amount is 50₸)")} / Баланс сейчас:{" "}
                                {Number(data?.profile?.balance?.current_balance)?.toFixed(0)}₸
                            </p>
                            <input
                                type="number"
                                prefix="₸"
                                {...register("incom", { required: true, min: 50 })}
                                style={{
                                    margin: 0,
                                    borderColor: "var( --gray-color)",
                                }}
                            />
                        </div>
                        <div className="item-form">
                            <Button className="login-submit" htmlType="submit">
                                <p>{t("Top up your balance")}</p>
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default PayData
