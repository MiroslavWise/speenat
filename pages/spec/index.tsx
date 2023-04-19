import { NextPage } from "next";
import { useQuery } from "react-query";

import { Button } from "antd";

import Loader from "@loader-spin";

import { specializations, specializationDelete } from "api/api-user";
import { work_experience } from "functions/work-exp";
import { useRouter } from "next/router";

const Spec: NextPage = () => {
        const { push } = useRouter()
        const {data, isLoading, refetch} = useQuery(["specializations"], () => specializations())

        console.log("data: ", data)

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
                                                        >
                                                                <div className="descriptions">
                                                                        <p>ВУЗ: <span>{item?.university}</span></p>
                                                                        <p>Опыт работы: <span>{work_experience(item?.work_experience)}</span></p>
                                                                        <p>Категория: <span>{item?.get_category_display}</span></p>
                                                                        <p>Продолжительность консультации: </p>
                                                                        {
                                                                                item?.consultation_time?.map(time => (
                                                                                        <p
                                                                                                key={`${time?.id}_${time?.sessions_time}_time`}
                                                                                                style={{marginLeft: 10}}
                                                                                        >
                                                                                                <span>{time?.sessions_time} - { time?.price }₸</span>
                                                                                        </p>
                                                                                ))
                                                                        }
                                                                        <br />
                                                                        <div className="buttons">
                                                                                <Button
                                                                                        className="login-submit"
                                                                                        onClick={() => push(`/spec/edit/${item?.id}`)}
                                                                                >
                                                                                        <p>Изменить</p>
                                                                                </Button>
                                                                                <Button
                                                                                        className="state-revers"
                                                                                        onClick={() => onDeleteSpec(item?.id)}
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