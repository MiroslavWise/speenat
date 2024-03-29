import { NextPage } from "next"

import { Divider } from "antd/lib"

import FormSpec from "components/spec-edit/FormSpec"
import ListAttachments from "components/spec-edit/ListAttachments"
import AttachmentsSpec from "components/spec-edit/AttachmentsSpec"

import { useDocumentTitle } from "hooks/useDocumentTitle"

const EditSpec: NextPage = () => {
    useDocumentTitle("Editing a specialization")

    return (
        <div className="content-archive">
            <div className="header-archive" />
            <div className="forms-edit">
                <FormSpec />
                <Divider />
                <ListAttachments edit />
                <AttachmentsSpec />
            </div>
        </div>
    )
}

export default EditSpec
