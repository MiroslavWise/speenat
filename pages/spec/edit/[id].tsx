import { NextPage } from "next";

import { Divider } from "antd"

import FormSpec from "components/spec-edit/FormSpec";
import ListAttachments from "components/spec-edit/ListAttachments";
import AttachmentsSpec from "components/spec-edit/AttachmentsSpec";

const EditSpec: NextPage = () => {

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