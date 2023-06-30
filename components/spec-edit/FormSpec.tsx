import { FC, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useRouter } from "next/router"

import { Form, Select, Input, Switch, Row, Button } from "antd"

import type { ISpecItems } from "types/store/user"

import Loader from "@loader-spin"

import { speakerSpecAdd, speakerSpecEdit, specializationsAllList } from "api/api-spec"
import { specializations } from "api/api-user"

const [{ Item }, { Option }] = [Form, Select]

export const CATEGORY: Record<'value' | 'label', string>[] = [
        { value: 'no_category', label: 'Без категории' },
        { value: 'first', label: 'Первая' },
        { value: 'second', label: 'Вторая' },
        { value: 'higher', label: 'Высшая' },
]

export const INITIAL_TIME = [
        // { id: 0, sessions_time: '5min', original_price: 0 },
        { id: 0, sessions_time: '20min', original_price: 0 },
        // { id: 0, sessions_time: '60min', original_price: 0 }
]



interface IValuesSpecUpdateData{
        specialization_id: number | string
        university: string
        scientific_degree: boolean
        work_experience: number
        category: string
        consultation_time: {
                '20min'?: number
                '5min'?: number
                '60min'?: number
        }

}

const FormSpec: FC = () => {
        const [form] = Form.useForm()
        const { query: { id } } = useRouter()
        const [loading, setLoading] = useState(false) 
        const { data: spec, isLoading: loadSpeakerSpec, refetch } = useQuery(['specializations'], () => specializations(), { refetchOnWindowFocus: false })
        const { data: specializationsAll, isLoading: loadSpecs } = useQuery(["specializations_all"], () => specializationsAllList(), { refetchOnWindowFocus: false })
        
        const currentSpec: ISpecItems | undefined = useMemo(() => {
                if (spec && id) return spec?.find(item => Number(item?.id) === Number(id))
                return undefined
        }, [spec, id])

        const object_time: any = useMemo(() => {
                const times: Record<string, number> = {}
                currentSpec?.consultation_time?.forEach(item => {
                        Object.assign(times, {[item?.sessions_time]: Number(item?.original_price)})
                })
                return times
        }, [currentSpec])


        const onUpdate = (values: IValuesSpecUpdateData) => {
                setLoading(true)
                if (!!currentSpec) {
                        const consultation_time = [
                                ...currentSpec?.consultation_time?.map(item => {
                                        return {
                                                ...item,
                                                id: item?.id,
                                                original_price: values.hasOwnProperty(item?.sessions_time) ? values?.consultation_time[item?.sessions_time] : 0,
                                                sessions_time: item?.sessions_time
                                        }
                                })
                        ]

                        const data = {
                                // ...currentSpec,
                                specialization_id: values?.specialization_id,
                                university: values?.university,
                                scientific_degree: values?.scientific_degree,
                                scientific_degree_text: '',
                                work_experience: values?.work_experience,
                                category: values?.category,
                                consultation_time: consultation_time,
                        }

                        //@ts-ignore
                        speakerSpecEdit(id, data)
                                .then(response => console.log("response: ", response))
                                .finally(() => {
                                        setLoading(false)
                                })
                }
                if (!currentSpec) {
                        const data = {
                                profile: {
                                        status: "online",
                                },
                                university: values?.university!,
                                scientific_degree: values?.scientific_degree!,
                                scientific_degree_text: '',
                                work_experience: values?.work_experience!,
                                category: values?.category!,
                                rating: 0,
                                attachments: [],
                        }
                        speakerSpecAdd(data)
                                .then(response => {
                                        console.log("response: ", response)
                                })
                                .catch(e => {
                                        console.log("error: ", e)
                                })
                                .finally(() => {
                                        setLoading(false)
                                })
                }
        }

        if(loadSpecs || loadSpeakerSpec) return <Loader />

        return (
                <Form
                        form={form}
                        className="form"
                        onFinish={onUpdate}
                        initialValues={{
                                specialization_id: currentSpec?.specialization_id,
                                university: currentSpec?.university,
                                work_experience: currentSpec?.work_experience,
                                category: currentSpec?.category,
                                consultation_time: object_time
                        }}
                >
                        <div className="item-form">
                                <p>Выберите специализацию</p>
                                <Form.Item
                                        name="specialization_id"
                                        rules={[{ required: true, message: 'Выберите специализацию!', },]}
                                >
                                        <Select
                                                className="form-input-select"
                                                size="large"
                                        >
                                                {
                                                        specializationsAll && specializationsAll?.length > 0
                                                        &&
                                                        specializationsAll?.map(item => (
                                                                <Option key={`${item?.id}_specs`} value={item?.id}>
                                                                        {item?.name}
                                                                </Option>
                                                        ))
                                                }
                                        </Select>
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Какой ВУЗ окончили</p>
                                <Form.Item
                                        name="university"
                                        rules={[{ required: true, message: 'Введите название ВУЗа!', },]}
                                >

                                        <Input maxLength={50} className="form-input" />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <Form.Item
                                        name="scientific_degree"
                                        rules={[{ required: false, message: 'Введите!', },]}
                                >
                                        <p>Научная степень</p>
                                        <Switch
                                                defaultChecked={currentSpec?.scientific_degree}
                                                style={{marginLeft: 10}}
                                        />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Опыт работы</p>
                                <Form.Item
                                        name="work_experience"
                                        rules={[{ required: true, message: 'Опыт работы(в годах)!', },]}
                                >
                                        <Input type="number" min={0} max={90} className="form-input"  />
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Категория</p>
                                <Form.Item
                                        name="category"
                                        rules={[{ required: true, message: 'Выберите категорию!', },]}
                                >
                                        
                                        <Select
                                                className="form-input-select"
                                                size="large"
                                        >
                                                {
                                                        CATEGORY.map(({ value, label}) => (
                                                                <Option
                                                                        key={`${value}_cat`}
                                                                        value={value}
                                                                >
                                                                        {label}
                                                                </Option>
                                                        ))
                                                }
                                        </Select>
                                </Form.Item>
                        </div>
                        <div className="item-form">
                                <p>Цена за сеанс(ы)</p>
                                {
                                        INITIAL_TIME.map(item => (
                                                <Row key={item?.sessions_time} style={{alignItems: 'center'}}>
                                                        <b> до {item?.sessions_time?.replace('min', ' мин')}: </b>
                                                        <Form.Item
                                                                name={['consultation_time', item?.sessions_time]}
                                                                style={{margin: 0, padding: 0}}
                                                        >
                                                                <Input
                                                                        type="number"
                                                                        style={{marginLeft: 10}}
                                                                        max={1000000}
                                                                        min={0}
                                                                        className="form-input"
                                                                />
                                                        </Form.Item>
                                                </Row>
                                        ))
                                }
                        </div>
                        <br />
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

export default FormSpec