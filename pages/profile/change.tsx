import { NextPage } from "next"

import { Divider } from "antd/lib"

import FormName from "components/profile/change/FormName"
import FormDataUser from "components/profile/change/FormDataUser"
import UpdatePhoto from "components/profile/change/UpdatePhoto"

import { useDocumentTitle } from "hooks/useDocumentTitle"

const Change: NextPage = () => {
    useDocumentTitle("Editing a profile")

    return (
        <div className="wrapper-profile show-animate">
            <div className="forms-edit">
                <FormName />
                <Divider />
                <FormDataUser />
                <Divider />
                <UpdatePhoto />
            </div>
        </div>
    )
}

export default Change
