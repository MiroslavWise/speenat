import { useTranslation } from "react-i18next"
import { FC, useEffect, useState } from "react"
import { Form, Button } from "antd/lib"
import { useRouter } from "next/router"

import RegisterForm from "./RegisterForm"
import SignForm from "./SignForm"
import { LanguagesOpenButton } from "./components/LanguagesOpenButton"

import { registerUser, IRegister } from "api/api-auth"
import { useAuth } from "store/use-auth"
import { useLoginEnter } from "store/use-login-enter"

interface IValues {
    email: string
    password: string
}

const ContainerSingAndRegister: FC = () => {
    const { t } = useTranslation()
    const { push } = useRouter()
    const { login } = useAuth()
    const [isState, setIsState] = useState(false)
    const [form] = Form.useForm()
    const { query } = useRouter()
    const setActiveLoginEnter = useLoginEnter((state) => state.setActive)
    const { referral_code } = query ?? {}

    useEffect(() => {
        if (referral_code) {
            setIsState(true)
            form.setFieldValue("referral_code", referral_code)
        }
    }, [referral_code])

    const onSubmit = (values: IValues) => {
        if (login) {
            login({ email: values.email.toLowerCase(), password: values.password }).finally(() => {
                push("/", undefined, { shallow: true })
                setActiveLoginEnter(true)
            })
        }
    }

    const onRegister = (values: IRegister) => {
        const { email, password, password2, is_speaker, referral_code, full_name, language_id } = values
        registerUser({
            email: email.toLowerCase(),
            password: password,
            password2: password2,
            is_speaker: is_speaker || false,
            referral_code: referral_code || "",
            full_name: full_name,
            profile: {
                accept_politics: true,
                accept_public_offer: true,
            },
            language_id: language_id || 1,
        }).then((response) => {
            if (response?.email?.toLowerCase() === email?.toLowerCase())
                if (login) {
                    login({ email: values.email.toLowerCase(), password: values.password }).finally(() => {
                        setActiveLoginEnter(true)
                    })
                }
        })
    }

    return (
        <div className={`__container-sign__ `}>
            <div className={`content `}>
                <h2 style={{ textAlign: "center" }}>{isState ? t("Registration") : t("Log in to your account")}</h2>
                <h4>{t("The fastest way to consult with a teacher")}</h4>
                <Form
                    form={form}
                    className="fields"
                    onFinish={isState ? onRegister : onSubmit}
                    initialValues={
                        isState
                            ? {
                                  is_speaker: false,
                              }
                            : {}
                    }
                >
                    {isState ? <RegisterForm /> : <SignForm />}
                    <Button htmlType="submit" className="login-submit" style={{ width: "100%" }}>
                        <p>{isState ? t("Registration") : t("Enter")}</p>
                    </Button>
                    <div className="register-component-button">
                        {!isState ? <p>{t("No account")}? </p> : null}
                        {!isState ? (
                            <a onClick={() => setIsState((state) => !state)}>{t("Registration")}</a>
                        ) : (
                            <a onClick={() => setIsState((state) => !state)}>{t("Enter")}</a>
                        )}
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default ContainerSingAndRegister
