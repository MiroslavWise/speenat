import { NextPage } from "next"
import { useTranslation } from "react-i18next"

import { Typography } from "antd/lib"

import { ButtonsSocial } from "components/invited/ButtonsSocial"

import { useDocumentTitle } from "hooks/useDocumentTitle"
import { useQuery } from "react-query"
import { profileMy } from "api/api-user"
import { useAuth } from "store/use-auth"

const Invited: NextPage = () => {
    const { t } = useTranslation()
    useDocumentTitle("Invitation")
    const token = useAuth(({ token }) => token)
    const { data } = useQuery({
        queryFn: () => profileMy(),
        queryKey: ["profile-me", token!],
        enabled: !!token,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    return (
        <div className="wrapper invited">
            <div className="link-invited">
                <p>{t("Your invitation link")}: </p>
                <Typography.Paragraph
                    copyable={{
                        text: `${data?.profile?.user?.full_name} ${
                            data?.profile?.gender === "female"
                                ? t("invited you to the Spenat service -female")
                                : t("invited you to the Spenat service -male")
                        } https://${process.env.NEXT_PUBLIC_FRONTEND}/?referral_code=${data?.profile?.referral_code}`,
                    }}
                    className="link"
                >
                    {data?.profile?.referral_code}
                </Typography.Paragraph>
                <ButtonsSocial />
            </div>
        </div>
    )
}

export default Invited
