import { FC } from "react"
import { useQuery } from "react-query"
import { Table } from "antd/lib"
import { companyAllOperations } from "api/api-user"
import { useTranslation } from "react-i18next"

const CompanyIncoming: FC = () => {
    const { t } = useTranslation()
    const { data, isLoading } = useQuery([], () => companyAllOperations())

    console.log("data: ", data)

    const columnsAmount = [
        {
            title: t("Название"),
            dataIndex: "name",
            key: "name",
            width: "70%",
        },
        {
            title: t("Количество"),
            dataIndex: "amount",
            key: "amount",
            render: (text: any) => (
                <b style={{ fontSize: "15px", whiteSpace: "nowrap" }}>{Number(text).toFixed(2)} ₸</b>
            ),
        },
    ]

    const dataSource = [
        {
            key: "5",
            name: t("Company turnover"),
            amount: `${data?.results?.statistic?.company_turnover || 0}`,
        },
        {
            key: "2",
            name: t("Total company income"),
            amount: `${data?.results?.statistic?.total_company_earning || 0}`,
        },
        {
            key: "4",
            name: t("Total Teacher Income"),
            amount: `${data?.results?.statistic?.speaker_set_earning || 0}`,
        },
        {
            key: "1",
            name: t("Average price per conference"),
            amount: `${data?.results?.statistic?.conference_payment_avg || 0}`,
        },
        {
            key: "3",
            name: t("Total income from the referral system"),
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
