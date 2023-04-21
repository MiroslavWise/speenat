import { FC, useState } from "react"

import { Button, DatePicker, Form, Input, Select } from "antd"

import { useUser } from "store/use-user"
import { updateDataUser, IValueDataUser } from "api/put-user"
import dayjs from "dayjs"
import moment from "moment"

const FormDataUser: FC = () => { 
        const [form] = Form.useForm()
        const [loading, setLoading]= useState(false)

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
                                                        message: 'Номер',
                                                },
                                                {
                                                        max: 11, min: 11, message: 'Введите 11 цифр номера!'
                                                }
                                        ]}
                                >
                                        <Input maxLength={11} type="number" className="form-input" />
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