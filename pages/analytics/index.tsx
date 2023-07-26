import { useMemo } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";

import { Table } from "antd";

import Loader from "@loader-spin";

import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUser } from "store/use-user";
import { conferenceAll, usersAll, speakersAll } from "api/api-user";

const columns = (t: (value: string) => string) => [
        {
                title: t("Title"),
                dataIndex: 'name',
                key: 'name',
                width: '85%'
        },
        {
                title: t("Quantity"),
                dataIndex: 'amount',
                key: 'amount',
                render: (text: string) => <b style={{ whiteSpace: "nowrap" }}>{text}</b>
        }
]

const Analytics: NextPage = () => {
        const { t } = useTranslation()
        const isStaff = useUser(state => state.is_staff)
        const loading = useUser(state => state.loading)
        useDocumentTitle("Analytics")

        const { data, isLoading } = useQuery(["analytics"], () => Promise.all([usersAll(), conferenceAll(), speakersAll()]))

        const dataSource =  useMemo(() => ([
                {
                        key: 'users',
                        name: `${t("Number of registered users")}:`,
                        amount: data?.[0]?.count || 0,
                },
                {
                        key: 'conferences',
                        name: `${t("Number of classes held")}:`,
                        amount: data?.[1]?.count || 0,
                },
                {
                        key: 'speakers',
                        name: `${t("Number of speakers")}:`,
                        amount: data?.[2]?.count || 0,
                }
        ]), [data])


        if (loading || isLoading) return <Loader />

        return (
                <div className="wrapper">
                                <Table
                                columns={columns(t)}
                                        dataSource={dataSource}
                                        showHeader={false}
                                        size={'small'}
                                        pagination={false}
                                />
                </div>
        )
}

export default Analytics