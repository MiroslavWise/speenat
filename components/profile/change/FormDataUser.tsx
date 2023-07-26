import { FC, useEffect, useState } from "react"
import dayjs from "dayjs"
import { Button, DatePicker, Form, Input, Select } from "antd"
import { useTranslation } from "react-i18next"
import { InputMask } from '@react-input/mask'

import { useUser } from "store/use-user"
import { changeNumber } from "functions/change-number"
import { updateDataUser, IValueDataUser } from "api/put-user"

const FormDataUser: FC = () => {
        const { t } = useTranslation()
        const [form] = Form.useForm()
        const [loading, setLoading] = useState(false)

        const user = useUser(state => state.user)
        const getReloadUser = useUser(state => state.getUserData)

        const onSubmit = (value: IValueDataUser) => {
                setLoading(true)
                updateDataUser({
                        ...value,
                        phone: value.phone.replace(/\D/g, "")
                })
                        .finally(() => {
                                getReloadUser(false)
                                setLoading(false)
                        })
        }

        return (
                <Form
                        form={form}
                        initialValues={{
                                phone: changeNumber(user?.profile?.phone?.toString()!),
                                address: user?.profile?.address,
                                gender: user?.profile?.gender,
                        } as IValueDataUser}
                        className="form"
                        onFinish={onSubmit}
                >
                        <div className="item-form">
                                <p>{t("Telephone")}</p>
                                <Form.Item
                                        name="phone"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: "+7 (___) ___-__-__",
                                                },
                                        ]}
                                >
                                        <InputMask
                                                className="form-input mask"
                                                mask="+7 (___) ___-__-__"
                                                replacement={{ _: /\d/ }}
                                        />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>{t("Address")}</p>
                                <Form.Item
                                        name="address"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: `${t("Enter the address")}!`,
                                                },
                                        ]}
                                >
                                        <Input maxLength={50} className="form-input" />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>{t("gender")}</p>
                                <Form.Item
                                        name="gender"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: `${t("Choose a gender")}!`,
                                                },
                                        ]}
                                >
                                        <Select
                                                className="form-input-select"
                                                size="large"
                                        >
                                                <Select.Option value="male">{t("Male")}</Select.Option>
                                                <Select.Option value="female">{t("Female")}</Select.Option>
                                        </Select>
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <Button
                                        className="login-submit"
                                        htmlType="submit"
                                        loading={loading}
                                >
                                        <p>{t("Update")}</p>
                                </Button>
                        </div>
                </Form>
        )
}

export default FormDataUser