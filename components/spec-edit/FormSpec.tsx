import { useTranslation } from "react-i18next"
import { FC, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useRouter } from "next/router"

import { Form, Select, Input, Switch, Button } from "antd/lib"

import type { ISpecItems } from "types/store/user"

import Loader from "@loader-spin"

import { speakerSpecAdd, speakerSpecEdit, specializationsAllList } from "api/api-spec"
import { specializations } from "api/api-user"
import { topicHandbooks } from "api/api-handbooks"

const [{ Item }, { Option }] = [Form, Select]

export const CATEGORY: Record<"value" | "label", string>[] = [
    { value: "no_category", label: "Без категории" },
    { value: "first", label: "Первая" },
    { value: "second", label: "Вторая" },
    { value: "higher", label: "Высшая" },
]

export const INITIAL_TIME = [
    // { id: 0, sessions_time: '5min', original_price: 0 },
    { id: 0, sessions_time: "20min", original_price: 0 },
    // { id: 0, sessions_time: '60min', original_price: 0 }
]

interface IValuesSpecUpdateData {
    specialization_id: number | string
    university: string
    scientific_degree: boolean
    work_experience: number
    category: string
    consultation_time: {
        "20min"?: number
        "5min"?: number
        "60min"?: number
    }
    additional_info: string
    region_living: string
    topic_conversation: number[]
}

const FormSpec: FC = () => {
    const { t } = useTranslation()
    const [form] = Form.useForm()
    const {
        query: { id },
        back,
        push,
    } = useRouter()
    const [loading, setLoading] = useState(false)
    const [pageTopic, setPageTopic] = useState(1)
    const {
        data: spec,
        isLoading: loadSpeakerSpec,
        refetch,
    } = useQuery(["specializations"], () => specializations(), {
        refetchOnWindowFocus: false,
    })
    const { data: specializationsAll, isLoading: loadSpecs } = useQuery(
        ["specializations_all"],
        () => specializationsAllList(),
        { refetchOnWindowFocus: false },
    )
    const { data: topicHandbooksAll } = useQuery(["topicHandbooksAll", pageTopic], () => topicHandbooks(), {
        refetchOnWindowFocus: false,
    })

    const currentSpec: ISpecItems | undefined = useMemo(() => {
        if (spec && id) return spec?.find((item) => Number(item?.id) === Number(id))
        return undefined
    }, [spec, id])

    const onUpdate = (values: IValuesSpecUpdateData) => {
        console.log("values: ", values)
        setLoading(true)
        if (!!currentSpec) {
            const consultation_time = [
                {
                    sessions_time: "20min",
                    original_price: values?.consultation_time,
                },
            ]
            const data = {
                id: Number(id),
                specialization_id: values.specialization_id,
                university: values.university,
                scientific_degree: values.scientific_degree || false,
                work_experience: values.work_experience || 0,
                consultation_time: consultation_time,
                region_living: values.region_living,
                additional_info: values.additional_info,
                topic_conversation: values.topic_conversation.map((item) => Number(item)),
            }

            //@ts-ignore
            speakerSpecEdit(id, data)
                .then((response) => {
                    console.log("response: ", response)
                    push(`/spec`, undefined, { shallow: true })
                })
                .finally(() => {
                    setLoading(false)
                })
        }
        if (!currentSpec) {
            const consultation_time = [
                {
                    sessions_time: "20min",
                    original_price: values?.consultation_time,
                },
            ]
            const data = {
                specialization_id: values.specialization_id,
                university: values.university || "",
                scientific_degree: values.scientific_degree || false,
                work_experience: values.work_experience || 0,
                consultation_time: consultation_time,
                region_living: values.region_living || "",
                additional_info: values.additional_info,
                topic_conversation: values.topic_conversation.map((item) => Number(item)),
            }
            //@ts-ignore
            speakerSpecAdd(data)
                .then((response) => {
                    console.log("response: ", response)
                    push(`/spec`, undefined, { shallow: true })
                })
                .catch((e) => {
                    console.log("error: ", e)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    if (loadSpecs || loadSpeakerSpec) return <Loader />

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
                consultation_time: currentSpec?.consultation_time?.find((item) => item?.sessions_time === "20min")
                    ?.original_price,
                region_living: currentSpec?.region_living,
                additional_info: currentSpec?.additional_info,
                topic_conversation: currentSpec?.topic_conversation?.map((item) => item?.id),
            }}
        >
            <div className="item-form">
                <p>{t("Choose a specialization")}</p>
                <Form.Item
                    name="specialization_id"
                    rules={[
                        {
                            required: true,
                            message: `${t("Choose a specialization")}!`,
                        },
                    ]}
                >
                    <Select className="form-input-select" size="large">
                        {specializationsAll &&
                            specializationsAll?.length > 0 &&
                            specializationsAll?.map((item) => (
                                <Option key={`${item?.id}_specs`} value={item?.id}>
                                    {item?.name}
                                </Option>
                            ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("Тема для общения")}</p>
                <Form.Item
                    name="topic_conversation"
                    rules={[
                        {
                            required: true,
                            message: `${t("Тема для общения")}!`,
                        },
                    ]}
                >
                    <Select className="form-input-select" size="large" mode="multiple">
                        {topicHandbooksAll?.results?.map((item) => (
                            <Option key={item.id + "topic"} value={item.id}>
                                {item.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("Which university did you graduate from")}</p>
                <Form.Item
                    name="university"
                    // rules={[{ required: true, message: 'Введите название ВУЗа!', },]}
                >
                    <Input maxLength={50} className="form-input" />
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("Scientific degree")}</p>
                <Form.Item name="scientific_degree" rules={[{ required: false, message: "Введите!" }]}>
                    <Switch defaultChecked={currentSpec?.scientific_degree} style={{ marginLeft: 10 }} />
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("Work experience")}</p>
                <Form.Item
                    name="work_experience"
                    // rules={[{ required: true, message: 'Опыт работы(в годах)!', },]}
                >
                    <Input type="number" min={0} max={90} className="form-input" />
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("Price per session(s)")}</p>
                <Form.Item
                    name="consultation_time"
                    style={{ margin: 0, padding: 0 }}
                    rules={[{ required: true, message: "Обязательное поле!" }]}
                >
                    <Input type="number" max={1000000} min={0} className="form-input" />
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("Region of residence")}</p>
                <Form.Item name="region_living">
                    <Input maxLength={50} className="form-input" />
                </Form.Item>
            </div>
            <div className="item-form">
                <p>{t("Additional information")}</p>
                <Form.Item name="additional_info">
                    <Input maxLength={50} className="form-input" />
                </Form.Item>
            </div>
            <br />
            <div className="item-form">
                <Button className="login-submit" htmlType="submit" loading={loading}>
                    <p>{t("Save")}</p>
                </Button>
            </div>
            <div className="item-form">
                <Button
                    className="state-revers"
                    onClick={() => {
                        back()
                    }}
                    loading={loading}
                >
                    <p>{t("Cancel")}</p>
                </Button>
            </div>
        </Form>
    )
}

export default FormSpec
