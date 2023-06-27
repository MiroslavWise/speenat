import { FC } from "react";


import { Form, Input } from "antd";

const { Item } = Form

const SignForm: FC = () => {
        return (
                <>
                        <Item
                                name="email"
                                className="user-box"
                                rules={[
                                        {
                                                type: 'email',
                                                message: 'Не валидный E-mail!',
                                        },
                                        {
                                                required: true,
                                                message: 'Пожалуйста, введите свой E-mail!',
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
                        >
                                <Input
                                        type="password"
                                        className="input-login"
                                        placeholder="Пароль"
                                />
                        </Item>
                        <a className="forgot-password">Забыли пароль?</a>
                </>
        )
}

export default SignForm