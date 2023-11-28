import { FC } from "react"
import { useQuery } from "react-query"

import { Table } from "antd/lib"

import { companyAllOperations } from "api/api-user"

const columnsAmount = [
    {
        title: "Название",
        dataIndex: "name",
        key: "name",
        width: "70%",
    },
    {
        title: "Количество",
        dataIndex: "amount",
        key: "amount",
        render: (text: any) => <b style={{ fontSize: "15px", whiteSpace: "nowrap" }}>{Number(text).toFixed(2)} ₸</b>,
    },
]

const CompanyIncoming: FC = () => {
    const { data, isLoading } = useQuery([], () => companyAllOperations())

    console.log("data: ", data)

    const dataSource = [
        {
            key: "5",
            name: "Оборот компании: ",
            amount: `${data?.results?.statistic?.company_turnover || 0}`,
        },
        {
            key: "2",
            name: "Общий доход компании: ",
            amount: `${data?.results?.statistic?.total_company_earning || 0}`,
        },
        {
            key: "4",
            name: "Общий доход преподавателей: ",
            amount: `${data?.results?.statistic?.speaker_set_earning || 0}`,
        },
        {
            key: "1",
            name: "Средняя цена за конференцию: ",
            amount: `${data?.results?.statistic?.conference_payment_avg || 0}`,
        },
        {
            key: "3",
            name: "Общий доход с реферальной системы: ",
            amount: `${data?.results?.statistic?.referral_system_earning || 0}`,
        },
    ]

    return (
        <>
            <Table
                columns={columnsAmount}
                dataSource={dataSource}
                showHeader={false}
                size={"small"}
                pagination={false}
            />
        </>
    )
}

export default CompanyIncoming
