import { FC } from "react";
import { useQuery } from "react-query";



import { companyAllOperations } from "api/api-user";

const columnsAmount = [
        {
                title: 'Название',
                dataIndex: 'name',
                key: 'name',
                width: '70%'
        },
        {
                title: 'Количество',
                dataIndex: 'amount',
                key: 'amount',
                render: (text: any) => <i style={{fontSize: '15px'}}>{Number(text).toFixed(2)} ₸</i>
        }
]


const CompanyIncoming: FC = () => {

        const { data, isLoading } = useQuery([], () => companyAllOperations())

        console.log("data: ", data)

        // const dataSource = [
        //         {
        //                 key: '5',
        //                 name: 'Оборот компании: ',
        //                 amount: `${statistic?.company_turnover || 0}`
        //         },
        //         {
        //                 key: '2',
        //                 name: 'Общий доход компании: ',
        //                 amount: `${statistic?.total_company_earning || 0}`
        //         },
        //         {
        //                 key: '4',
        //                 name: 'Общий доход докторов: ',
        //                 amount: `${statistic?.doctors_earning || 0}`
        //         },
        //         {
        //                 key: '1',
        //                 name: 'Средняя цена за конференцию: ',
        //                 amount: `${statistic?.conference_payment_avg || 0}`
        //         },
        //         {
        //                 key: '3',
        //                 name: 'Общий доход с реферальной системы: ',
        //                 amount: `${statistic?.referral_system_earning || 0}`
        //         },
        // ]

        
        return (
                <>
                </>
        )
}

export default CompanyIncoming