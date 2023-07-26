import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Form, Input, Radio, Space } from "antd";

const { Item } = Form

const RegisterForm: FC = () => {
        const { t } = useTranslation()

        return (
                <>
                        <Item
                                name="is_speaker"
                                className="user-box"
                        >
                                <Radio.Group>
                                        <Space direction="horizontal">
                                                <Radio value={false}><p>{ t("Student")}</p></Radio>
                                                <Radio value={true}><p>{ t("Speaker")}</p></Radio>
                                        </Space>
                                </Radio.Group>
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
                                <Input
                                        type="text"
                                        className="input-login"
                                        placeholder={`${t("How to contact you (full name)")}`}
                                />
                        </Item>
                        <Item
                                name="email"
                                className="user-box"
                                rules={[
                                        {
                                                type: 'email',
                                                message: `${t("Invalid E-mail")}!`,
                                        },
                                        {
                                                required: true,
                                                message: `${t("Please enter your E-mail")}!`,
                                        },
                                ]}
                        >
                                <Input
                                        type="text"
                                        className="input-login"
                                        placeholder="E-mail"
                                />
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
                                <Input.Password
                                        type="password"
                                        className="input-login"
                                        placeholder="Пароль"
                                />
                        </Item>
                        <Item
                                name="password2"
                                className="user-box"
                                dependencies={['password']}
                                rules={[
                                        {
                                                required: true,
                                                message: 'Введите пароль!',
                                                min: 4,
                                        },
                                        ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                        if (!value || getFieldValue('password') === value) {
                                                                return Promise.resolve();
                                                        }
                                                        return Promise.reject(new Error('Пароли не совпадают!'));
                                                },
                                        }),
                                ]}
                        >
                                <Input.Password
                                        type="password"
                                        className="input-login"
                                        placeholder={`${t("Password")}`}
                                />
                        </Item>
                        <Item
                                name="referral_code"
                                className="user-box"
                        >
                                <Input
                                        type="text"
                                        className="input-login"
                                        placeholder={`${t("Your promo code (optional field)")}`}
                                />
                        </Item>
                        
                </>
        )
}

export default RegisterForm