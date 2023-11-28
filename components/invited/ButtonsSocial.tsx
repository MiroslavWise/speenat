import Image from "next/image"
import { useQuery } from "react-query"
import { useTranslation } from "react-i18next"

import { profileMy } from "api/api-user"
import { useAuth } from "store/use-auth"
import { BUTTONS_SOCIAL } from "./constants"

import styles from "./styles/style.module.scss"

export function ButtonsSocial() {
    const { t } = useTranslation()
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
        <ul className={styles.containerButtons}>
            {BUTTONS_SOCIAL({
                url: `https://${process.env.NEXT_PUBLIC_FRONTEND}/?referral_code=${data?.profile?.referral_code}`,
                text: `${data?.profile?.user?.full_name} ${
                    data?.profile?.gender === "female"
                        ? t("invited you to the Spenat service -female")
                        : t("invited you to the Spenat service -male")
                }`,
            }).map((item) => (
                <li key={item.link} onClick={() => window.open(item.link)}>
                    <Image src={item.icon} alt={item.icon} width={32} height={32} />
                </li>
            ))}
        </ul>
    )
}
