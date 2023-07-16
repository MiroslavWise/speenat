import { FC, useEffect, useState } from "react"

import { Button, DatePicker, Form, Input, Select } from "antd"

import { useUser } from "store/use-user"
import { updateDataUser, IValueDataUser } from "api/put-user"
import dayjs from "dayjs"
import moment from "moment"

const FormDataUser: FC = () => {
        const [form] = Form.useForm()
        const [number, setNumber] = useState("")
        const [loading, setLoading] = useState(false)

        const user = useUser(state => state.user)
        const getReloadUser = useUser(state => state.getUserData)

        const onSubmit = (value: IValueDataUser) => {
                setLoading(true)
                updateDataUser(value)
                        .finally(() => {
                                getReloadUser(false)
                                setLoading(false)
                        })
        }

        useEffect(() => {
                if (user?.profile?.phone) {
                        setNumber(user?.profile?.phone)
                } else {
                        setNumber("+7 ")
                }
        }, [user?.profile?.phone])

        const handleChange = (event: any) => {
                const inputPhoneNumber = event.target.value
                if (inputPhoneNumber.startsWith('+7 ')) {
                        setNumber(inputPhoneNumber)
                }
        }

        return (
                <Form
                        form={form}
                        initialValues={{
                                phone: user?.profile?.phone,
                                address: user?.profile?.address,
                                birthday: user?.profile?.birthday ? dayjs(user?.profile?.birthday) : dayjs(),
                                gender: user?.profile?.gender,
                        } as IValueDataUser}
                        className="form"
                        onFinish={onSubmit}
                >
                        <div className="item-form">
                                <p>Телефон</p>
                                <Form.Item
                                        name="phone"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: "+7 (___) ___-__-__",
                                                },
                                        ]}
                                >
                                        <Input
                                                className="form-input"
                                                value={number}
                                                onChange={handleChange}
                                        />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Адрес</p>
                                <Form.Item
                                        name="address"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: 'Введите адрес!',
                                                },
                                        ]}
                                >
                                        <Input maxLength={50} className="form-input" />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Пол</p>
                                <Form.Item
                                        name="gender"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: 'Выберите пол!',
                                                },
                                        ]}
                                >
                                        <Select
                                                className="form-input-select"
                                                size="large"
                                        >
                                                <Select.Option value="male">Мужской</Select.Option>
                                                <Select.Option value="female">Женский</Select.Option>
                                        </Select>
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Дата рождения</p>
                                <Form.Item
                                        name="birthday"
                                        rules={[
                                                {
                                                        required: true,
                                                        message: 'Введите адрес!',
                                                },
                                        ]}
                                >
                                        <DatePicker
                                                className="form-input date-picker"
                                                format={"DD-MM-YYYY"}
                                                disabledDate={current => dayjs(current).valueOf() > moment().valueOf()}
                                        />
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

export default FormDataUser