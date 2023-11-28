import { FC } from "react"
import { useTranslation } from "react-i18next"
import { Form, Input } from "antd/lib"
import { LanguagesOpenButton } from "./components/LanguagesOpenButton"

const { Item } = Form

const SignForm: FC = () => {
    const { t } = useTranslation()
    return (
        <>
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
            <Item name="password" className="user-box">
                <Input.Password type="password" className="input-login" placeholder={`${t("Password")}`} />
            </Item>
            <div
                style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
            >
                <LanguagesOpenButton />
                <a className="forgot-password">{t("Forgot your password")}?</a>
            </div>
        </>
    )
}

export default SignForm
