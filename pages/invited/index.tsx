import { NextPage } from "next";
import { useTranslation } from "react-i18next";

import { Typography } from "antd";

import ListInvited from "components/invited/ListInvited";
import { useDocumentTitle } from "hooks/useDocumentTitle";

const Invited: NextPage = () => {
        const { t } = useTranslation()
        useDocumentTitle("Invitation")
        return (
                <div className="wrapper invited">
                        <div className="link-invited">
                                <p>{t("Your invitation link")}: </p>
                                <Typography.Paragraph copyable className="link">{ "" }</Typography.Paragraph>
                        </div>
                        
                        <ListInvited />
                </div>
        )
}

export default Invited