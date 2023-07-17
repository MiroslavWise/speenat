import { useMemo } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { Divider, Button } from "antd";

import type { ISpecItems } from "types/store/user";

import Loader from "@loader-spin";
import ListAttachments from "components/spec-edit/ListAttachments";

import { specializationDelete, specializations } from "api/api-user";
import { work_experience } from "functions/work-exp";
import { useDocumentTitle } from "hooks/useDocumentTitle";


const CurrentSpec: NextPage = () => {
        const { query: { id }, push } = useRouter()
        const { data, isLoading, refetch } = useQuery(["specializations"], () => specializations())
        useDocumentTitle("Моя специализация")

        const currentSpec: ISpecItems | undefined = useMemo(() => {
                if (data) return data?.find(item => Number(item?.id) === Number(id))
                return undefined
        }, [data])

        const onDeleteSpec = (value: number) => {
                specializationDelete(value)
                        .finally(() => {
                                refetch()
                                push('/spec')
                        })
        }

        if (isLoading) return <Loader />

        return (
                <div className="content-archive">
                        <div className="header-archive" />
                        <div className="list-archive form">
                                <div className="buttons">
                                        <Button
                                                className="login-submit"
                                                onClick={(event) => {
                                                        event.preventDefault()
                                                        event.stopPropagation()
                                                        push(`/spec/edit/${id}`)
                                                }}
                                        >
                                                <p>Изменить</p>
                                        </Button>
                                        <Button
                                                className="state-revers"
                                                onClick={() => onDeleteSpec(Number(id))}
                                        >
                                                <p>Удалить</p>
                                        </Button>
                                </div>
                                <div className="item-form">
                                        <p>ВУЗ:</p>
                                        <i>{currentSpec?.university || ""}</i>
                                </div>
                                <div className="item-form">
                                        <p>Научная степень:</p>
                                        <i>{currentSpec?.scientific_degree ? "Есть" : "Нет"}</i>
                                </div>
                                {
                                        currentSpec?.work_experience
                                                ? (
                                                        <div className="item-form">
                                                                <p>Опыт работы:</p>
                                                                <i>{work_experience(currentSpec?.work_experience || 0)}</i>
                                                        </div>
                                                ) : null
                                }
                                <div className="item-form">
                                        <p>Цена за сеанс(ы):</p>
                                        {
                                                currentSpec && currentSpec?.consultation_time?.length > 0
                                                &&
                                                currentSpec?.consultation_time?.map(item => (
                                                        <i>до {item?.sessions_time?.replace('min', ' мин')}: {item?.price}₸</i>
                                                ))
                                        }
                                </div>
                                {
                                        currentSpec?.region_living
                                                ? (
                                                        <div className="item-form">
                                                                <p>Регион проживания:</p>
                                                                <i>{currentSpec?.region_living}</i>
                                                        </div>
                                                ) : null
                                }
                                {
                                        currentSpec?.additional_info
                                                ? (
                                                        <div className="item-form">
                                                                <p>Дополнительные сведения:</p>
                                                                <i>{currentSpec?.additional_info}</i>
                                                        </div>
                                                ) : null
                                }
                                <Divider />
                                <ListAttachments edit={false} />
                        </div>
                </div>
        )
}

export default CurrentSpec