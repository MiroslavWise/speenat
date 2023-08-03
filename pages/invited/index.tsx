import { NextPage } from "next";
import { useTranslation } from "react-i18next";

import { Typography } from "antd";

import ListInvited from "components/invited/ListInvited";
import { useDocumentTitle } from "hooks/useDocumentTitle";
import { useUser } from "store/use-user";


const Invited: NextPage = () => {
        const { t } = useTranslation()
        useDocumentTitle("Invitation")
        const user = useUser(state => state.user)
        return (
                <div className="wrapper invited">
                        <div className="link-invited">
                                <p>{t("Your invitation link")}: </p>
                                <Typography.Paragraph
                                        copyable={{
                                                text: `https://${process.env.NEXT_PUBLIC_FRONTEND}/?referral_code${user?.profile?.referral_code}`
                                        }}
                                        className="link"
                                >
                                        {user?.profile?.referral_code}
                                </Typography.Paragraph>
                        </div>
                        <ListInvited />
                </div>
        )
}

export default Invited