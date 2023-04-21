import { FC, useCallback, useState } from "react"

import { Button, Form, Input, Row, Space, message } from "antd"
import userData from "helpers/user-data"
import { useAuth } from "context/Authorization"
import { registerUser, IRegister } from "api/api-auth"

const { Item } = Form

interface IValues{
        email: string
        password: string
}

interface IReturnAccess{
        access: boolean,
        error: {
                message: string
                stack: string
        } | null
}

const ContainerSingAndRegister: FC = () => {
        const { setAuthState } = useAuth()
        const [isSign, setIsSign] = useState(false)
        const [isState, setIsState] = useState(false)
        const [form] = Form.useForm()

        const onSubmit = useCallback((values: IValues) => {
                userData.login({ email: values.email, password: values.password })
                        .then((response: IReturnAccess) => {
                                if (response?.access === true && response.error === null) {
                                        setIsSign(true)
                                        setTimeout(() => {
                                                setAuthState('main')
                                        }, 380)
                                }
                                if (response?.access === false) {
                                        if (response.error !== null && response.error.message === "No token supplied") {
                                                message.error("Не верный логин или пароль!")
                                        } else {
                                                message.error(response.error?.message)
                                        }
                                }
                        })
        }, [form])

        //is_speaker

        const onRegister = (values: IRegister) => {
                const { email, password, password2, is_speaker, referral_code, full_name } = values
                registerUser({
                        email: email,
                        password: password,
                        password2: password2,
                        is_speaker: is_speaker || false,
                        referral_code: referral_code || "",
                        full_name: full_name,
                        profile: {
                                accept_politics: true,
                                accept_public_offer: true
                        }
                })
                        .then(response => {
                                if (response?.email === email) {
                                        userData.login({ email: response?.email, password: password })
                                        .then((response: IReturnAccess) => {
                                                if (response?.access === true && response.error === null) {
                                                        setIsSign(true)
                                                        setTimeout(() => {
                                                                setAuthState('main')
                                                        }, 380)
                                                }
                                                if (response?.access === false) {
                                                        if (response.error !== null && response.error.message === "No token supplied") {
                                                                message.error("Не верный логин или пароль!")
                                                        } else {
                                                                message.error(response.error?.message)
                                                        }
                                                }
                                        })
                                } else {
                                        message.error("Юзер с такими же данными уже существует")
                                }
                        })
                // setIsSign(true)
                // form.resetFields()
        }

        return (
                <div className={`__container-sign__ ${isSign && 'animate'}`}>
                        <div className={`content `}>
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
                                                                        name="full_name"
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
                                                                        <Input
                                                                                type="password"
                                                                                className="input-login"
                                                                                placeholder="Пароль"
                                                                        />
                                                                </Item>
                                                                <Item
                                                                        name="referral_code"
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
                </div>
        )
}

export default ContainerSingAndRegister