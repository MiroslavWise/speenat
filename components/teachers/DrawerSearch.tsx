import { Dispatch, FC, SetStateAction, useState } from "react"

import { Button, Divider, Drawer, Rate, InputNumber, Row, Space } from "antd"

import type { TDuration } from "types/store/search"

import { useSearch } from "store/use-search"
import { DURATION, STATUS_ONLINE, VERIFIED } from "./constants"

interface IProps{
        open: boolean

        setOpen: Dispatch<SetStateAction<boolean>>
}

const DrawerSearch: FC<IProps> = ({ open, setOpen }) => {
        const handleClose = () => setOpen(false)

        const duration = useSearch(state => state.duration)
        const price = useSearch(state => state.price)
        const rate = useSearch(state => state.rate)
        const statusOnline = useSearch(state => state.status)
        const verified = useSearch(state => state.verified)
        const use = useSearch(state => state.use)

        const [duration_, setDuration_] = useState<TDuration>(duration)
        const [price_, setPrice_] = useState<{ min: number, max: number }>({
                min: price[0],
                max: price[1],
        })
        const [rate_, setRate_] = useState(rate)
        const [statusOnline_, setStatusOnline_] = useState(statusOnline)
        const [verified_, setVerified_] = useState(verified)

        const onSearch = () => {
                

                handleClose()
        }

        return (
                <Drawer
                        title={null}
                        closable={false}
                        placement="bottom"
                        onClose={handleClose}
                        open={open}
                        style={{
                                height: '100%',
                        }}
                >
                        <div className="wrapper-search">
                                <div className="block-search">
                                        <p>Длительность сессии</p>
                                        <div className="buttons">
                                                {
                                                        DURATION.map(item => (
                                                                <Button
                                                                        key={`${item}_duration`}
                                                                        className={`button-duration ${item === duration_ && 'active'}`}
                                                                        onClick={() => { setDuration_(item) }}
                                                                >
                                                                        <p>{ item } минут</p>
                                                                </Button>
                                                        ))
                                                }
                                        </div>
                                </div>
                                <Divider />
                                <div className="block-search">
                                        <p>Цена сессии</p>
                                        <div className="inputs">
                                                <InputNumber
                                                        className="input"
                                                        type="number"
                                                        min={0}
                                                        defaultValue={price_.min}
                                                        max={price_.max}
                                                        onChange={(value) => setPrice_({
                                                                ...price_,
                                                                min: Number(value)
                                                        })}
                                                />
                                                <InputNumber
                                                        className="input"
                                                        type="number"
                                                        min={0}
                                                        defaultValue={price_.max}
                                                        max={100000}
                                                        onChange={(value) => setPrice_({
                                                                ...price_,
                                                                max: Number(value)
                                                        })}
                                                />
                                        </div>
                                </div>
                                <Divider />
                                <div className="block-search">
                                        <p>Рейтинг Преподавателя</p>
                                        <Rate
                                                defaultValue={rate_}
                                                onChange={(value) => setRate_(value)}
                                                
                                        />
                                </div>
                                <Divider />
                                <div className="block-search">
                                        <p>Статус онлайн</p>
                                        <div className="buttons">
                                                {
                                                        STATUS_ONLINE.map(item => (
                                                                <Button
                                                                        key={`${item.value}_status`}
                                                                        className={`button-duration ${item.value === statusOnline_ && 'active'}`}
                                                                        onClick={() => { setStatusOnline_(item.value) }}
                                                                >
                                                                        <p>{ item.label }</p>
                                                                </Button>
                                                        ))
                                                }
                                        </div>
                                </div>
                                <Divider />
                                <div className="block-search">
                                        <p>Проверен</p>
                                        <div className="buttons">
                                                {
                                                        VERIFIED.map(item => (
                                                                <Button
                                                                        key={`${item.value}_status`}
                                                                        className={`button-duration ${item.value === verified_ && 'active'}`}
                                                                        onClick={() => { setVerified_(item.value) }}
                                                                >
                                                                        <p>{ item.label }</p>
                                                                </Button>
                                                        ))
                                                }
                                        </div>
                                </div>
                                <Divider />
                                <Row justify="end">
                                        <Space>
                                                <Button
                                                        className="cancel-button"
                                                        onClick={handleClose}
                                                >
                                                        <p>Отмена</p>
                                                </Button>
                                                <Button
                                                        className="search-button"
                                                        onClick={onSearch}
                                                >
                                                        <p>Найти</p>
                                                </Button>
                                        </Space>
                                </Row>
                        </div>
                </Drawer>
        )
}

export default DrawerSearch