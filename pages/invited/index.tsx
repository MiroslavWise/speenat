import { NextPage } from "next"
import { useTranslation } from "react-i18next"

import { Typography } from "antd/lib"

import { ButtonsSocial } from "components/invited/ButtonsSocial"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useUser } from "store/use-user"

const Invited: NextPage = () => {
    const { t } = useTranslation()
    useDocumentTitle("Invitation")
    const user = useUser(({ user }) => user)

    return (
        <div className="wrapper invited">
            <div className="link-invited">
                <p>{t("Your invitation link")}: </p>
                <Typography.Paragraph
                    copyable={{
                        text: `${user?.profile?.user?.full_name} ${
                            user?.profile?.gender === "female"
                                ? t("invited you to the Spenat service -female")
                                : t("invited you to the Spenat service -male")
                        } https://${process.env.NEXT_PUBLIC_FRONTEND}/?referral_code=${user?.profile?.referral_code}`,
                    }}
                    className="link"
                >
                    {user?.profile?.referral_code}
                </Typography.Paragraph>
                <ButtonsSocial />
            </div>
            {/* <ListInvited /> */}
        </div>
    )
}

export default Invited
