import { FC, useEffect, useState } from "react";

import { Button, Form, Input, Row, Space } from "antd";

const { Item } = Form

interface IValues{
        login: string
        password: string
}

interface IRegister{
        name: string
        login: string
        password: string
        password_two: string
        promo: string
}

const ContainerSingAndRegister: FC = () => {
        const [isSign, setIsSign] = useState(false)
        const [isState, setIsState] = useState(false)
        const [form] = Form.useForm()

        const onSubmit = (values: IValues) => {
                setIsSign(true)
                form.resetFields()
        }

        const onRegister = (values: IRegister) => {

                setIsSign(true)
                form.resetFields()
        }

        return (
                <div className={`__container-sign__ ${isSign && 'out-in-sign'}`}>
                        <div className={`content`}>
                                <h2 style={{ textAlign: "center" }}>{ isState ? 'Регистрация' : 'Войти' }</h2>
                                <Form
                                        className="fields"
                                        onFinish={isState ? onRegister : onSubmit}
                                >
                                        {
                                                isState
                                                        ?
                                                        <>
                                                                <Item
                                                                        name="name"
                                                                        className="user-box"
                                                                        rules={[
                                                                                {
                                                                                        required: true,
                                                                                        message: 'Введите ваше имя',
                                                                                        min: 2,
                                                                                },
                                                                        ]}
                                                                >
                                                                        <Input
                                                                                type="text"
                                                                                className="input-login"
                                                                                placeholder="Как к Вам обращаться (ФИО)"
                                                                        />
                                                                </Item>
                                                                <Item
                                                                        name="login"
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
                                                                        rules={[
                                                                                {
                                                                                        required: true,
                                                                                        message: 'Введите пароль!',
                                                                                        min: 4,
                                                                                },
                                                                        ]}
                                                                >
                                                                        <Input
                                                                                type="password"
                                                                                className="input-login"
                                                                                placeholder="Пароль"
                                                                        />
                                                                </Item>
                                                                <Item
                                                                        name="password_two"
                                                                        className="user-box"
                                                                        dependencies={['password']}
                                                                        // hasFeedback
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
                                                                        <Input
                                                                                type="password"
                                                                                className="input-login"
                                                                                placeholder="Пароль"
                                                                        />
                                                                </Item>
                                                                <Item
                                                                        name="promo"
                                                                        className="user-box"
                                                                >
                                                                        <Input
                                                                                type="text"
                                                                                className="input-login"
                                                                                placeholder="Ваш промокод"
                                                                        />
                                                                </Item>
                                                        </>
                                                        :
                                                        <>
                                                                <Item
                                                                        name="login"
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
                                                        </>
                                        }
                                        <Row align="middle" justify="end">
                                                <Space direction="horizontal" style={{alignItems: "center"}}>
                                                        <Button
                                                                type="text"
                                                                className="state-revers"
                                                                onClick={() => setIsState(state => !state)}
                                                        >
                                                                <p>{!isState ? 'Регистрация' : 'Войти'}</p>
                                                        </Button>
                                                        <Button
                                                                htmlType="submit"
                                                                className="login-submit"
                                                        >
                                                                <p>{ isState ? 'Регистрация' : 'Войти' }</p>
                                                        </Button>
                                                </Space>
                                        </Row>
                                </Form>
                        </div>
                        <div className="__elem-sign-1__" />
                        <div className="__elem-sign-2__" />
                </div>
        )
}

export default ContainerSingAndRegister