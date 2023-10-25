import { Button, Form, InputNumber } from "antd"
import { NextPage } from "next"
import { useTranslation } from "react-i18next"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useUser } from "store/use-user"

const PayData: NextPage = () => {
    const { t } = useTranslation()
    const isSpeaker = useUser((state) => state.is_speaker)
    useDocumentTitle("Online_payments")

    const onOutMoney = (values: { "money-out": any }) => {}

    const onInMoney = (values: { "money-incom": any }) => {}

    const checkPrice50 = (_: any, value: { number: number }) => {
        if (value.number > 50) {
            return Promise.resolve()
        }
        return Promise.reject(new Error("Сумма не менее 50₸!"))
    }

    const checkPrice250 = (_: any, value: { number: number }) => {
        if (value.number > 250) {
            return Promise.resolve()
        }
        return Promise.reject(new Error("Сумма не менее 250₸!"))
    }

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
                            <Form.Item
                                name="money-out"
                                rules={
                                    [
                                        // { validator: checkPrice250 }
                                    ]
                                }
                            >
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
                <Form
                    onFinish={onInMoney}
                    className="list-archive form"
                    initialValues={{
                        "money-incom": 50,
                    }}
                >
                    <div className="item-money">
                        <p className="title">{t("Withdrawal of money")}</p>
                        <div className="item-form">
                            <p>{t("Specify the deposit amount (the minimum deposit amount is 50₸)")}</p>
                            <Form.Item
                                name="money-incom"
                                rules={
                                    [
                                        // {
                                        //         validator: checkPrice50,
                                        // }
                                    ]
                                }
                            >
                                <InputNumber
                                    min={50}
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
                                <p>{t("Top up your balance")}</p>
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </div>
    )
}

export default PayData
