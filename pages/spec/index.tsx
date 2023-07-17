import { NextPage } from "next";
import { useQuery } from "react-query";

import { Button } from "antd";

import Loader from "@loader-spin";

import { useDocumentTitle } from "hooks/useDocumentTitle";
import { specializations, specializationDelete } from "api/api-user";
import { work_experience } from "functions/work-exp";
import { useRouter } from "next/router";

const Spec: NextPage = () => {
        const { push } = useRouter()
        const { data, isLoading, refetch } = useQuery(["specializations"], () => specializations())
        useDocumentTitle("Мои специализации")

        const onDeleteSpec = (value: number) => {
                specializationDelete(value)
                        .finally(refetch)
        }

        if (isLoading) return <Loader />

        return (
                <div className="content-archive">
                        <div className="header-archive" />
                        <div className="list-archive">
                                {
                                        data && data?.length > 0
                                                ? data?.map(item => (
                                                        <div
                                                                key={`${item?.id}_item_spec`}
                                                                className="item-archive"
                                                                onClick={(event) => {
                                                                        event.stopPropagation()
                                                                        event.preventDefault()
                                                                        push(`/spec/${item?.id}`)
                                                                }}
                                                        >
                                                                <div className="descriptions">
                                                                        <p>ВУЗ: <span>{item?.university}</span></p>
                                                                        <p>Опыт работы: <span>{work_experience(item?.work_experience)}</span></p>
                                                                        <p>Продолжительность консультации: <span>{item?.consultation_time?.find(item => item?.sessions_time === "20min")?.original_price}₸</span></p>
                                                                        {
                                                                                item?.region_living
                                                                                ? <p>Регион проживания: <span>{item?.region_living}</span></p> : null
                                                                        }
                                                                        {
                                                                                item?.additional_info
                                                                                        ? <p>Дополнительные сведения: <span>{item?.additional_info}</span></p> : null
                                                                        }
                                                                        <br />
                                                                        <div className="buttons">
                                                                                <Button
                                                                                        className="login-submit"
                                                                                        onClick={(event) => {
                                                                                                event.preventDefault()
                                                                                                event.stopPropagation()
                                                                                                push(`/spec/edit/${item?.id}`)
                                                                                        }}
                                                                                >
                                                                                        <p>Изменить</p>
                                                                                </Button>
                                                                                <Button
                                                                                        className="state-revers"
                                                                                        onClick={(event) => {
                                                                                                event.preventDefault()
                                                                                                event.stopPropagation()
                                                                                                onDeleteSpec(item?.id)
                                                                                        }}
                                                                                >
                                                                                        <p>Удалить</p>
                                                                                </Button>
                                                                        </div>
                                                                </div>
                                                        </div>
                                        )) : null
                                }
                                <Button
                                        className="login-submit"
                                        onClick={() => push(`/spec/edit/`)}
                                >
                                        <p>Добавить</p>
                                </Button>
                        </div>

                </div>
        )
}

export default Spec