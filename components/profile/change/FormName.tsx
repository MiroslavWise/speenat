import { useTranslation } from "react-i18next"
import { FC, useState } from "react"

import { Button, Form, Input } from "antd/lib"

import { useUser } from "store/use-user"
import { updateUser } from "api/put-user"

const FormName: FC = () => {
    const { t } = useTranslation()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const user = useUser((state) => state.user)
    const getReloadUser = useUser((state) => state.getUserData)

    const onSubmit = (value: { name: string }) => {
        setLoading(true)
        updateUser(value).finally(() => {
            getReloadUser(false)
            setLoading(false)
        })
    }

    return (
        <Form
            form={form}
            initialValues={{
                name: user?.profile?.user?.full_name,
                email: user?.profile?.user?.email,
            }}
            className="form"
            onFinish={onSubmit}
        >
            <div className="item-form">
                <p>E-mail</p>
                <Form.Item
                    name="email"
                    rules={[
                        {
                            required: true,
                            message: `${t("Enter your Email")}!`,
                        },
                    ]}
                >
                    <Input maxLength={25} className="form-input disabled" disabled />
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("How to contact you (full name)")}</p>
                <Form.Item
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: `${t("Enter a name")}!`,
                        },
                    ]}
                >
                    <Input maxLength={25} className="form-input" />
                </Form.Item>
            </div>
            <div className="item-form">
                <Button className="login-submit" htmlType="submit" loading={loading}>
                    <p>{t("Update")}</p>
                </Button>
            </div>
        </Form>
    )
}

export default FormName
