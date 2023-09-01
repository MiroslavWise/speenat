import { NextPage } from "next"

import FormSpec from "components/spec-edit/FormSpec"

import { useDocumentTitle } from "hooks/useDocumentTitle"

const AddSpec: NextPage = () => {
    useDocumentTitle("Creating a specialization")

    return (
        <div className="content-archive">
            <div className="header-archive" />
            <div className="forms-edit">
                <FormSpec />
            </div>
        </div>
    )
}

export default AddSpec
