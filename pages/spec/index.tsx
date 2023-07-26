import { NextPage } from "next";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

import { Button } from "antd";

import Loader from "@loader-spin";

import { useDocumentTitle } from "hooks/useDocumentTitle";
import { specializations, specializationDelete } from "api/api-user";
import { work_experience } from "functions/work-exp";

const Spec: NextPage = () => {
        const { t } = useTranslation()
        const { push } = useRouter()
        const { data, isLoading, refetch } = useQuery(["specializations"], () => specializations())
        useDocumentTitle("Specialization")

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
                                                                        <p style={{ textAlign: "center" }}>{item?.specialization?.name}</p>
                                                                        <p>{t("UNIVERSITY")}: <span>{item?.university || <i>{t("The university is not filled")}</i>}</span></p>
                                                                        <p>{t("Work experience")}: <span>{work_experience(item?.work_experience, t)}</span></p>
                                                                        <p>{t("Duration of the consultation")}: <span>{item?.consultation_time?.find(item => item?.sessions_time === "20min")?.original_price}₸</span></p>
                                                                        <p>{t("Region of residence")}: <span>{item?.region_living || <i>{t("The region of residence is not filled in")}</i>}</span></p>
                                                                        <p>{t("Additional information")}: <span>{item?.additional_info || <i>{t("Additional information is not filled in")}</i>}</span></p>
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
                                                                                        <p>{t("To change")}</p>
                                                                                </Button>
                                                                                <Button
                                                                                        className="state-revers"
                                                                                        onClick={(event) => {
                                                                                                event.preventDefault()
                                                                                                event.stopPropagation()
                                                                                                onDeleteSpec(item?.id)
                                                                                        }}
                                                                                >
                                                                                        <p>{t("Remove")}</p>
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
                                        <p>{t("Add")}</p>
                                </Button>
                        </div>

                </div>
        )
}

export default Spec