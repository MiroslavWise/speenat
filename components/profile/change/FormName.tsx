import { FC, useState } from "react"

import { Button, Form, Input } from "antd"

import { useUser } from "store/use-user"
import { updateUser } from "api/put-user"

const FormName: FC = () => {
        const [form] = Form.useForm()
        const [loading, setLoading]= useState(false)

        const user = useUser(state => state.user)
        const getReloadUser = useUser(state => state.getUserData)

        const onSubmit = (value: { name: string }) => {
                setLoading(true)
                updateUser(value)
                        .finally(() => {
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
                                                        message: 'Введите имя!',
                                                },
                                        ]}
                                >
                                        <Input maxLength={25} className="form-input disabled" disabled />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Как к Вам обращаться (ФИО)</p>
                                <Form.Item
                                        name="name"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: 'Введите имя!',
                                                },
                                        ]}
                                >
                                        <Input maxLength={25} className="form-input" />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <Button
                                        className="login-submit"
                                        htmlType="submit"
                                        loading={loading}
                                >
                                        <p>Обновить</p>
                                </Button>
                        </div>
                </Form>
        )
}

export default FormName