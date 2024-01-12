import { FC, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Form, Input, Radio, Select, Space } from "antd/lib"

import { languages } from "api/api-user"
import { useQuery } from "react-query"

const { Item } = Form

const RegisterForm: FC = () => {
    const { t } = useTranslation()

    const { data, isLoading } = useQuery(["languages"], () => languages())

    return (
        <>
            <Item name="is_speaker" className="user-box">
                <Radio.Group defaultValue={false}>
                    <Space direction="horizontal">
                        <Radio value={false}>
                            <p>Student</p>
                        </Radio>
                        <Radio value={true}>
                            <p>Speaker</p>
                        </Radio>
                    </Space>
                </Radio.Group>
            </Item>
            <Item name="language_id" className="user-box">
                <Select
                    loading={isLoading}
                    options={
                        data
                            ? data?.results?.map((item) => ({
                                  value: item?.id,
                                  label: item.name,
                              }))
                            : []
                    }
                    placeholder={`Выберите предпочитаемый язык`}
                />
            </Item>
            <Item
                name="full_name"
                className="user-box"
                rules={[
                    {
                        required: true,
                        message: `${t("Enter your name")}`,
                        min: 2,
                    },
                ]}
            >
                <Input type="text" className="input-login" placeholder={`${t("How to contact you (full name)")}`} />
            </Item>
            <Item
                name="email"
                className="user-box"
                rules={[
                    {
                        type: "email",
                        message: `${t("Invalid E-mail")}!`,
                    },
                    {
                        required: true,
                        message: `${t("Please enter your E-mail")}!`,
                    },
                ]}
            >
                <Input type="text" className="input-login" placeholder="E-mail" />
            </Item>
            <Item
                name="password"
                className="user-box"
                rules={[
                    {
                        required: true,
                        message: `${t("Enter the password")}!`,
                        min: 4,
                    },
                ]}
            >
                <Input.Password type="password" className="input-login" placeholder="Пароль" />
            </Item>
            <Item
                name="password2"
                className="user-box"
                dependencies={["password"]}
                rules={[
                    {
                        required: true,
                        message: "Введите пароль!",
                        min: 4,
                    },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve()
                            }
                            return Promise.reject(new Error("Пароли не совпадают!"))
                        },
                    }),
                ]}
            >
                <Input.Password type="password" className="input-login" placeholder={`${t("Password")}`} />
            </Item>
            <Item name="referral_code" className="user-box">
                <Input type="text" className="input-login" placeholder={`${t("Your promo code (optional field)")}`} />
            </Item>
        </>
    )
}

export default RegisterForm
