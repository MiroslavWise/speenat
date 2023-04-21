import Image from "next/image"
import { FC } from "react"

import type { ISpec } from "types/store/user"

import { work_experience } from "functions/work-exp"
import { Button } from "antd"
import Time from "@icons-time"
import Wallet from "@icons-wallet"

const Specialization: FC<{ data: ISpec[] | undefined, online: boolean }> = ({ data, online }) => {
        const handleBell = () => {

        }
        
        return (
                <div className="list-spec">
                        {
                                data && data?.length > 0
                                &&
                                data?.map(item => (
                                        <div
                                                key={`${item?.profile?.id}_${item?.specialization_id}`}
                                                className="container-spec"
                                        >
                                                <div className="title">
                                                        <div className="image-headphone">
                                                                <Image
                                                                        src="/gif/headphone.gif"
                                                                        alt="gif"
                                                                        height={30}
                                                                        width={30}
                                                                        className="img"
                                                                />
                                                        </div>
                                                        <div style={{display: "flex", flexDirection: 'column', gap: 7,}}>
                                                                <p className="name">{item?.specialization?.name}</p>
                                                                <p className="sub-name"> {item?.specialization?.description}</p>
                                                        </div>
                                                </div>
                                                <div className="content">
                                                        <p className="name">Опыт работы и образование:</p>
                                                        <p className="sub-name"><b>ВУЗ: </b>{item?.university}</p>
                                                        <p className="sub-name"><b>Стаж: </b>{work_experience(item?.work_experience)}</p>
                                                        <p className="sub-name"><b>Категория: </b>{item?.get_category_display}</p>
                                                </div>
                                                <div className="consultation-time-list">
                                                        {
                                                                item?.consultation_time?.map(time => (
                                                                        <div className="bell-container" key={`time_${time?.id}`}>
                                                                                {
                                                                                        online ? (
                                                                                                <Button
                                                                                                        type="text"
                                                                                                        className="but-bell"
                                                                                                        onClick={handleBell}
                                                                                                >
                                                                                                        <p>Позвонить</p>
                                                                                                </Button>
                                                                                        ) : null
                                                                                }
                                                                                <div className="times">
                                                                                        <Time size={25} fill="var(--cyan)" />
                                                                                        <p>{ time?.sessions_time }</p>
                                                                                </div>
                                                                                <div className="times">
                                                                                        <Wallet size={25} fill="var(--cyan)" />
                                                                                        <p>{ time?.price }₸</p>
                                                                                </div>
                                                                        </div>
                                                                ))
                                                        }
                                                </div>
                                        </div>
                                ))
                        }
                </div>
        )
}

export default Specialization


// { value: 'no_category', label: 'Без категории' },
// { value: 'first', label: 'Первая' },
// { value: 'second', label: 'Вторая' },
// { value: 'higher', label: 'Высшая' }