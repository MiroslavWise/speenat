import { Dispatch, FC, SetStateAction, useState } from "react"
import { useTranslation } from "react-i18next"
import { useQuery } from "react-query"
import { Button, Divider, Drawer, Row, Space, Select, Input } from "antd/lib"

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
    const { filters, getFilters } = useProfiles(
        (state) => ({
            filters: state.filters,
            getFilters: state.getFilter,
            language: state.filters.language,
            // setLanguage: state.setLanguage,
        }),
        shallow,
    )
    const [pageTopic, setPageTopic] = useState(1)
    const { data: topicHandbooksAll } = useQuery(["topicHandbooksAll", pageTopic], () => topicHandbooks(), {
        refetchOnWindowFocus: false,
    })

    const use = useSearch((state) => state.use)
    const [price_, setPrice_] = useState<{ min: number; max: number }>({
        min: filters.price_gte,
        max: filters.price_lte,
    })
    const [statusOnline_, setStatusOnline_] = useState<TStatus | "">(filters.speaker__status)
    const [verified_, setVerified_] = useState<boolean | "">(filters.verified)
    const [topicConversation, setTopicConversation] = useState<number[]>(filters.topic_conversation)
    const [language, setLanguage] = useState<string | "">(filters.language)
    const [searchQuery, setSearchQuery] = useState<string>("")

    const applyFilters = () => {
        getFilters({
            search: searchQuery,
            price_gte: price_.min,
            price_lte: price_.max,
            speaker__status: statusOnline_,
            verified: verified_,
            page: 1,
            topic_conversation: topicConversation,
            language: language,
        })
    }

    return (
        <Drawer title={null} closable={false} placement="bottom" onClose={handleClose} open={open} height={"auto"}>
            <div className="wrapper-search">
                <Divider />
                <div className="block-search">
                    <p>{t("Search")}</p>
                    <Input
                        className={styles.searchInput}
                        placeholder={t("Enter speaker name")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
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
                        onChange={(value) => {
                            setTopicConversation(value)
                            applyFilters()
                        }}
                        clearIcon
                        onClear={() => setTopicConversation([])}
                        allowClear
                    />
                </div>
                <Divider />
                <div className="block-search">
                    <p>{t("Language")}</p>
                    <Select
                        className={styles.selectFilter}
                        placeholder={t("Choose language")}
                        options={[
                            { value: "english", label: t("English") },
                            { value: "spanish", label: t("Spanish") },
                            { value: "kazakhstan", label: t("kazakhstan") },
                        ]}
                        onChange={(value) => {
                            setLanguage(value)
                            applyFilters()
                        }}
                        clearIcon
                        onClear={() => setLanguage("")}
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
                                className={`button-duration ${item.value === statusOnline_ && "active"}`}
                                onClick={() => {
                                    setStatusOnline_(item.value)
                                    applyFilters()
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
                                className={`button-duration ${item.value === verified_ && "active"}`}
                                onClick={() => {
                                    setVerified_(item.value)
                                    applyFilters()
                                }}
                            >
                                <p>{t(item.label)}</p>
                            </Button>
                        ))}
                    </div>
                </div>
                <Divider />
            </div>
        </Drawer>
    )
}

export default DrawerSearch
