import { useTranslation } from "react-i18next"
import { FC, useEffect, useState } from "react"

import Image from "next/image"
import { Upload } from "antd/lib"

import type { UploadProps } from "antd"
import type { RcFile } from "antd/es/upload"
import type { UploadFile } from "antd/es/upload/interface"

import { updatePhotoUser } from "api/put-user"
import { useUser } from "store/use-user"
import { replaceHttps } from "functions/replace-https"
import loadImage from "functions/load-image"

const UpdatePhoto: FC = () => {
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = useState<any[]>([])

    const user = useUser((state) => state.user?.profile)
    const getUpdateUser = useUser((state) => state.getUserData)

    useEffect(() => {}, [])

    const props: UploadProps = {
        maxCount: 1,
        multiple: false,
        onChange(file: any) {
            setFileList([file])
        },
        onRemove: (file: UploadFile) => {
            const index = fileList.indexOf(file)
            const newFileList = fileList.slice()
            newFileList.splice(index, 1)
            setFileList(newFileList)
        },
        fileList: [],
        style: {
            background: "#FFFFFF",
            maxWidth: 792,
            width: "100%",
            height: 200,
            marginBottom: 20,
        },
        listType: "picture",
        beforeUpload: async (file: RcFile) => {
            onUpdate(file)
        },
        disabled: loading,
    }

    const onUpdate = (file: RcFile) => {
        setLoading(true)
        const formData = new FormData()
        formData.append("photo", file)
        updatePhotoUser(formData).finally(() => {
            getUpdateUser(false)
            setLoading(false)
        })
    }

    return (
        <div className="form">
            <div className="item-form">
                <p>{t("Select a photo")}</p>
                <div className="photo-item">
                    <Upload.Dragger {...props} accept=".jpg, .png, .jpeg, image/png, image/jpg, image/jpeg">
                        <p className="ant-upload-text p-2">{t("Click to download")}</p>
                        <p className="ant-upload-hint">(.png, .jpeg, .jpg)</p>
                    </Upload.Dragger>
                    {user?.photo && (
                        <Image
                            loader={loadImage}
                            src={user?.photo ? replaceHttps(user?.photo) : "/images/flower.jpg"}
                            alt=""
                            height={140}
                            width={140}
                            style={{
                                aspectRatio: 1 / 1,
                                objectFit: "cover",
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default UpdatePhoto
