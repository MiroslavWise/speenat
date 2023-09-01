import { FC, useMemo, useState } from "react"
import { useQuery } from "react-query"
import { useRouter } from "next/router"
import Image from "next/image"
import { useTranslation } from "react-i18next"
import { Button, Row } from "antd"

import Loader from "@loader-spin"

import { specializations } from "api/api-user"
import loadImage from "functions/load-image"
import { replaceHttps } from "functions/replace-https"
import { speakerSpecAttachmentDelete } from "api/api-spec"

const ListAttachments: FC<{ edit: boolean }> = ({ edit }) => {
    const { t } = useTranslation()
    const {
        query: { id },
    } = useRouter()
    const [loading, setLoading] = useState(false)
    const { data, isLoading, refetch } = useQuery(["specializations"], () =>
        specializations(),
    )

    const currentAttachments = useMemo(() => {
        if (data) {
            return data
                ?.find((item) => Number(item?.id) === Number(id))
                ?.attachments?.filter((item) => item?.file)
        }
        return []
    }, [data]) as { file: string | null; id: number; name: string }[] | []

    const handleDelete = (id: number) => {
        setLoading(true)
        speakerSpecAttachmentDelete(id)
            .then((data) => {
                console.log("delete: ", data)
            })
            .finally(() => {
                refetch().finally(() => {
                    setLoading(false)
                })
            })
    }

    if (isLoading) return <Loader />

    return (
        <div className="attachments">
            {currentAttachments?.length > 0 &&
                currentAttachments?.map((item) => (
                    <div key={`${item?.id}_attach`} className="item-attach">
                        <Image
                            loader={loadImage}
                            src={replaceHttps(item?.file || "")}
                            alt="a"
                            height={500}
                            width={500}
                            style={{ objectFit: "cover" }}
                            className="img-item"
                        />
                        <p>
                            {item?.name === "undefined"
                                ? ""
                                : item?.name
                                ? item?.name
                                : ""}
                        </p>
                        {edit && (
                            <Button
                                className="button-delete"
                                onClick={() => {
                                    handleDelete(item?.id)
                                }}
                                disabled={loading}
                            >
                                <p>{t("Remove")}</p>
                            </Button>
                        )}
                    </div>
                ))}
        </div>
    )
}

export default ListAttachments