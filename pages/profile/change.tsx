import { NextPage } from "next";

import { Divider } from "antd";

import FormName from "components/profile/change/FormName";
import FormDataUser from "components/profile/change/FormDataUser";
import UpdatePhoto from "components/profile/change/UpdatePhoto";

const Change: NextPage = () => {

        return (
                <div className="wrapper-profile show-animate">
                        <div className="header-profile" />
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
