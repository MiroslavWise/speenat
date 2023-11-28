import { FC, useState } from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { useTranslation } from "react-i18next"

import { Button } from "antd/lib"

import { speakerSpecAttachment } from "api/api-spec"
import { specializations } from "api/api-user"

const AttachmentsSpec: FC = () => {
    const { t } = useTranslation()
    const {
        query: { id },
    } = useRouter()
    const { refetch } = useQuery(["specializations"], () => specializations())
    const {
        register,
        getValues,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: "onBlur",
        reValidateMode: "onChange",
    })

    const [isFileLoading, setIsFileLoading] = useState(false)
    const formData = new FormData()

    const on = (data: any) => {
        console.log("object data: ", data)
        setIsFileLoading(true)
        speakerSpecAttachment(data)
            .then((data) => console.log("data: ", data))
            .finally(() => {
                refetch().finally(() => {
                    setIsFileLoading(false)
                })
            })
    }

    const onSubmitAddNewDiploma = (data: any) => {
        formData.append("file", data.file[0])
        formData.append("specialization_id", id as string)
        formData.append("name", getValues("name") || " ")
        on(formData)
    }

    return (
        <form onSubmit={handleSubmit(onSubmitAddNewDiploma)} className="form w-100">
            <div className="item-form">
                <p>{t("Enter the name of the document")}</p>
                <input
                    style={{
                        padding: 5,
                        fontSize: 15,
                        height: 25,
                        borderRadius: 17,
                    }}
                    id="name"
                    {...register("name", {
                        // required: true,
                    })}
                />
            </div>
            <br />
            {/* {errors.name && <span style={{color: 'red', fontSize: 13}}>Это поле обязательно</span>} */}
            <div className="item-form">
                <p>{t("Add a document")} ( jpeg, jpg, pdf ):</p>
                <div className="form-input" style={{ position: "relative", width: "calc(100% - 20px)" }}>
                    <input
                        className="form-control"
                        style={{
                            padding: 5,
                            fontSize: 15,
                            height: 25,
                            borderRadius: 17,
                            width: "calc(100% - 40px)",
                        }}
                        id="diploma"
                        type="file"
                        {...register("file", {
                            required: `${t("Attach the file")}`,
                            validate: {
                                // eslint-disable-next-line arrow-body-style
                                typeFile: (value) => {
                                    console.log("value: ", value)
                                    return (
                                        value[0]?.type === "image/jpeg" ||
                                        value[0]?.type === "image/jpg" ||
                                        value[0]?.type === "image/png" ||
                                        value[0]?.type === "png"
                                    )
                                },
                            },
                        })}
                    />
                    {t("Select a file")}
                </div>
                {/* {errors.file && errors.file.type === 'typeFile' && <span style={{color: 'red', fontSize: 13}}>Файл должен быть типа - jpeg, jpg, pdf</span> } */}
            </div>
            <br />
            <div className="item-form">
                <Button className="login-submit" htmlType="submit" loading={isFileLoading}>
                    <p>{t("Download")}</p>
                </Button>
            </div>
        </form>
    )
}

export default AttachmentsSpec
