import { Dispatch, FC, SetStateAction, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { Button, Divider, Drawer, InputNumber, Row, Space, Select } from "antd"

import type { TStatus } from "types/store/user"

import { useSearch } from "store/use-search"
import { useProfiles } from "store/use-profiles"
import { topicHandbooks } from "api/api-handbooks"
import { STATUS_ONLINE, VERIFIED } from "./constants"

import styles from "./style.module.scss"
import { shallow } from "zustand/shallow"
interface IProps {
    open: boolean

    setOpen: Dispatch<SetStateAction<boolean>>
}

const DrawerSearch: FC<IProps> = ({ open, setOpen }) => {
    const { t } = useTranslation()
    const handleClose = () => setOpen(false)
    const { filters, getFilters } = useProfiles(state => ({
        filters: state.filters,
        getFilters: state.getFilter,
    }), shallow)
    const [pageTopic, setPageTopic] = useState(1)
    const { data: topicHandbooksAll } = useQuery(
        ["topicHandbooksAll", pageTopic],
        () => topicHandbooks(),
        { refetchOnWindowFocus: false },
    )

    const use = useSearch((state) => state.use)
    const [price_, setPrice_] = useState<{ min: number; max: number }>({
        min: filters.price_gte,
        max: filters.price_lte,
    })
    const [statusOnline_, setStatusOnline_] = useState<TStatus | "">(
        filters.speaker__status,
    )
    const [verified_, setVerified_] = useState<boolean | "">(filters.verified)
    const [topicConversation, setTopicConversation] = useState<number[]>(
        filters.topic_conversation,
    )

    const onSearch = () => {
        getFilters({
            price_gte: price_.min,
            price_lte: price_.max,
            speaker__status: statusOnline_,
            verified: verified_,
            page: 1,
            topic_conversation: topicConversation,
        })
        handleClose()
    }

    return (
        <Drawer
            title={null}
            closable={false}
            placement="bottom"
            onClose={handleClose}
            open={open}
            height={"auto"}
        >
            <div className="wrapper-search">
                <div className="block-search">
                    <p>{t("Session price")}</p>
                    <div className="inputs">
                        <InputNumber
                            className="input"
                            type="number"
                            min={0}
                            defaultValue={price_.min}
                            max={price_.max}
                            onChange={(value) =>
                                setPrice_({
                                    ...price_,
                                    min: Number(value),
                                })
                            }
                        />
                        <InputNumber
                            className="input"
                            type="number"
                            min={0}
                            defaultValue={price_.max}
                            max={100000}
                            onChange={(value) =>
                                setPrice_({
                                    ...price_,
                                    max: Number(value),
                                })
                            }
                        />
                    </div>
                </div>
                <Divider />
                <div className="block-search">
                    <p>{t("Topics for communication")}</p>
                    <Select
                        className={styles.selectFilter}
                        placeholder={t("Topics for communication")!}
                        mode="multiple"
                        options={
                            Array.isArray(topicHandbooksAll?.results)
                                ? topicHandbooksAll?.results?.map((item) => ({
                                    value: item.id,
                                    label: item.name,
                                }))
                                : []
                        }
                        onChange={setTopicConversation}
                        clearIcon
                        onClear={() => setTopicConversation([])}
                        allowClear
                    />
                </div>
                <Divider />
                <div className="block-search">
                    <p>{t("Online Status")}</p>
                    <div className="buttons">
                        {STATUS_ONLINE.map((item) => (
                            <Button
                                key={`${item.value}_status`}
                                className={`button-duration ${item.value === statusOnline_ && "active"
                                    }`}
                                onClick={() => {
                                    setStatusOnline_(item.value)
                                }}
                            >
                                <p>{t(item.label)}</p>
                            </Button>
                        ))}
                    </div>
                </div>
                <Divider />
                <div className="block-search">
                    <p>{t("Verified")}</p>
                    <div className="buttons">
                        {VERIFIED.map((item) => (
                            <Button
                                key={`${item.value}_status`}
                                className={`button-duration ${item.value === verified_ && "active"
                                    }`}
                                onClick={() => {
                                    setVerified_(item.value)
                                }}
                            >
                                <p>{t(item.label)}</p>
                            </Button>
                        ))}
                    </div>
                </div>
                <Divider />
                <Row justify="end">
                    <Space>
                        <Button className="cancel-button" onClick={handleClose}>
                            <p>{t("Cancel")}</p>
                        </Button>
                        <Button className="search-button" onClick={onSearch}>
                            <p>{t("To find")}</p>
                        </Button>
                    </Space>
                </Row>
            </div>
        </Drawer>
    )
}

export default DrawerSearch
