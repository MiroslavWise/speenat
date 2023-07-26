import { useTranslation } from "react-i18next"
import { FC, useCallback, useState } from "react"
import { Button, Form, Input, message } from "antd"

import RegisterForm from "./RegisterForm"
import SignForm from "./SignForm"

import userData from "helpers/user-data"
import { useAuth } from "context/Authorization"
import { registerUser, IRegister } from "api/api-auth"

interface IValues {
        email: string
        password: string
}

interface IReturnAccess {
        access: boolean,
        error: {
                message: string
                stack: string
        } | null
}

const ContainerSingAndRegister: FC = () => {
        const { t } = useTranslation()
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
                                                message.error(`${t("Invalid username or password")}!`)
                                        } else {
                                                message.error(response.error?.message)
                                        }
                                }
                        })
        }, [form])

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
                                                                        message.error(`${t("Invalid username or password")}!`)
                                                                } else {
                                                                        message.error(response.error?.message)
                                                                }
                                                        }
                                                })
                                } else {
                                        message.error(`${t("A user with the same data already exists")}`)
                                }
                        })
        }

        return (
                <div className={`__container-sign__ ${isSign && 'animate'}`}>
                        <div className={`content `}>
                                <h2 style={{ textAlign: "center" }}>{isState ? t("Registration") : t("Log in to your account")}</h2>
                                <h4>{t("The fastest way to consult with a teacher")}</h4>
                                <Form
                                        className="fields"
                                        onFinish={isState ? onRegister : onSubmit}
                                        initialValues={
                                                isState
                                                        ? {
                                                                is_speaker: false,
                                                        } : {}
                                        }
                                >
                                        {
                                                isState
                                                        ? <RegisterForm />
                                                        : <SignForm />
                                        }
                                        <Button
                                                htmlType="submit"
                                                className="login-submit"
                                                style={{ width: '100%' }}
                                        >
                                                <p>{isState ? t("Registration") : t("Enter")}</p>
                                        </Button>
                                        <div className="register-component-button">
                                                {
                                                        !isState ? <p>{ t("No account")}? </p> : null
                                                }
                                                {
                                                        !isState ? <a onClick={() => setIsState(state => !state)}>{t("Registration")}</a> : <a onClick={() => setIsState(state => !state)}>{t("Enter")}</a>
                                                }
                                        </div>
                                </Form>
                                </div>
                </div>
        )
}

export default ContainerSingAndRegister