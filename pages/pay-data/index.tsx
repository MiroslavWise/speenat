import { useState } from "react"
import { NextPage } from "next"
import { useTranslation } from "react-i18next"
import { Button, Form, InputNumber } from "antd/lib"
import { useForm } from "react-hook-form"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useUser } from "store/use-user"

import { apiCreateOrder } from "api/api-order"
import { useQuery } from "react-query"
import { profileMy } from "api/api-user"

interface IValues {
    incom: number
    radio: TRadio
    input?: number | string
}

type TRadio = "1000" | "5000" | "10000" | "10000+"
interface IRadios {
    label: string
    value: TRadio
}

const RADIOS: IRadios[] = [
    {
        label: "1 000",
        value: "1000",
    },
    {
        label: "5 000",
        value: "5000",
    },
    {
        label: "10 000",
        value: "10000",
    },
    {
        label: "свыше 10 000",
        value: "10000+",
    },
]

const PayData: NextPage = () => {
    useDocumentTitle("Online_payments")
    const { t } = useTranslation()
    const isSpeaker = useUser(({ is_speaker }) => is_speaker)
    const user = useUser(({ user }) => user)
    const { register, handleSubmit, setValue, setError, watch } = useForm<IValues>({
        defaultValues: {
            radio: "1000",
            input: 10_000,
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
            if (values?.radio) {
                let amount = +values?.radio

                if (values?.radio === "10000+") {
                    if (Number(values.input) <= 10_000) {
                        amount = 10_000
                    } else {
                        amount = Number(values.input) || 10_000
                    }
                }

                apiCreateOrder({ amount: amount })
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
                            <b>Выберите сумму для пополнения баланса: </b>
                            <div data-grid>
                                {RADIOS.map((item) => (
                                    <div
                                        key={`${item.value}-v-----`}
                                        data-item-grid
                                        {...register("radio", { required: true })}
                                        onClick={() => {
                                            setValue("radio", item.value)
                                        }}
                                        data-is={item.value === watch("radio")}
                                    >
                                        <div data-radio>
                                            <div />
                                        </div>
                                        <span>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div data-input={watch("radio") === "10000+"}>
                                <b>Введите сумму:</b>
                                <input type="number" {...register("input", { required: false, min: 10_000 })} />
                            </div>
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

{
    /* <input
type="number"
prefix="₸"
{...register("incom", { required: true, min: 50 })}
style={{
    margin: 0,
    borderColor: "var( --gray-color)",
}}
/> */
}
