import { FC } from "react";


import { Form, Input, Radio, Space } from "antd";

const { Item } = Form

const RegisterForm: FC = () => {

        return (
                <>
                        <Item
                                name="is_speaker"
                                className="user-box"
                        >
                                <Radio.Group>
                                        <Space direction="horizontal">
                                                <Radio value={false}><p>Студент</p></Radio>
                                                <Radio value={true}><p>Преподаватель</p></Radio>
                                        </Space>
                                </Radio.Group>
                        </Item>
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
        )
}

export default RegisterForm