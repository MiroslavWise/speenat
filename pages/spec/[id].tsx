import { useMemo } from "react"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { useQuery } from "react-query"
import { useTranslation } from "react-i18next"

import { Divider, Button } from "antd/lib"

import type { ISpecItems } from "types/store/user"

import Loader from "@loader-spin"
import ListAttachments from "components/spec-edit/ListAttachments"

import { specializationDelete, specializations } from "api/api-user"
import { work_experience } from "functions/work-exp"
import { useDocumentTitle } from "hooks/useDocumentTitle"

const CurrentSpec: NextPage = () => {
    const { t } = useTranslation()
    const {
        query: { id },
        push,
    } = useRouter()
    const { data, isLoading, refetch } = useQuery(["specializations"], () => specializations())
    useDocumentTitle("Specialization")

    const currentSpec: ISpecItems | undefined = useMemo(() => {
        if (data) return data?.find((item) => Number(item?.id) === Number(id))
        return undefined
    }, [data])

    const onDeleteSpec = (value: number) => {
        specializationDelete(value).finally(() => {
            refetch()
            push("/spec")
        })
    }

    if (isLoading) return <Loader />

    return (
        <div className="content-archive">
            <div className="header-archive" />
            <div className="list-archive form">
                <div className="item-form">
                    <p>Язык общения:</p>
                    <i>{currentSpec?.specialization?.name}</i>
                </div>
                <div className="item-form">
                    <p>Темы общения:</p>
                    <i>{currentSpec?.topic_conversation?.map((item) => item?.name)?.join(", ")}</i>
                </div>
                <div className="item-form">
                    <p>{t("UNIVERSITY")}:</p>
                    <i>{currentSpec?.university || <span>{t("The university is not filled")}</span>}</i>
                </div>
                <div className="item-form">
                    <p>{t("Scientific degree")}:</p>
                    <i>{currentSpec?.scientific_degree ? t("be") : t("No")}</i>
                </div>
                {currentSpec?.work_experience ? (
                    <div className="item-form">
                        <p>{t("Work experience")}:</p>
                        <i>{work_experience(currentSpec?.work_experience || 0, t)}</i>
                    </div>
                ) : null}
                <div className="item-form">
                    <p>{t("Price per session(s)")}:</p>
                    {currentSpec &&
                        currentSpec?.consultation_time?.length > 0 &&
                        currentSpec?.consultation_time?.map((item) => (
                            <i>
                                до {item?.sessions_time?.replace("min", " мин")}: {item?.price}₸
                            </i>
                        ))}
                </div>
                <div className="item-form">
                    <p>{t("Region of residence")}:</p>
                    <i>{currentSpec?.region_living || <span>{t("The region of residence is not filled in")}</span>}</i>
                </div>
                <div className="item-form">
                    <p>{t("Additional information")}:</p>
                    <i>{currentSpec?.additional_info || <span>{t("Additional information is not filled in")}</span>}</i>
                </div>
                <Divider />
                <ListAttachments edit={false} />
                <div className="buttons">
                    <Button
                        className="login-submit"
                        onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            push(`/spec/edit/${id}`)
                        }}
                    >
                        <p>{t("To change")}</p>
                    </Button>
                    <Button className="state-revers" onClick={() => onDeleteSpec(Number(id))}>
                        <p>{t("Remove")}</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CurrentSpec
