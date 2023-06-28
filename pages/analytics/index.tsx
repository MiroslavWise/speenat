import { NextPage } from "next";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

import { Table } from "antd";

import Loader from "@loader-spin";

import { useUser } from "store/use-user";
import { conferenceAll, usersAll, speakersAll } from "api/api-user";
import { useMemo } from "react";

const columns = [
        {
                title: 'Название',
                dataIndex: 'name',
                key: 'name',
                width: '85%'
        },
        {
                title: 'Количество',
                dataIndex: 'amount',
                key: 'amount',
                render: (text: string) => <b style={{ whiteSpace: "nowrap" }}>{text}</b>
        }
]

const Analytics: NextPage = () => {
        const isStaff = useUser(state => state.is_staff)
        const loading = useUser(state => state.loading)

        const { data, isLoading } = useQuery(["analytics"], () => Promise.all([usersAll(), conferenceAll(), speakersAll()]))

        const dataSource =  useMemo(() => ([
                {
                        key: 'users',
                        name: 'Кол-во зарегистрированных пользователей:',
                        amount: data?.[0]?.count || 0,
                },
                {
                        key: 'conferences',
                        name: 'Кол-во проведенных занятий:',
                        amount: data?.[1]?.count || 0,
                },
                {
                        key: 'speakers',
                        name: 'Кол-во спикеров:',
                        amount: data?.[2]?.count || 0,
                }
        ]), [data])


        if (loading || isLoading) return <Loader />

        return (
                <div className="wrapper">
                                <Table
                                        columns={columns}
                                        dataSource={dataSource}
                                        showHeader={false}
                                        size={'small'}
                                        pagination={false}
                                />
                </div>
        )
}

export default Analytics