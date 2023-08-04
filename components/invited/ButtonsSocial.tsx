import { useTranslation } from "react-i18next"

import { useUser } from "store/use-user"

import { BUTTONS_SOCIAL } from "./constants"

import styles from "./styles/style.module.scss"
import Image from "next/image"

export function ButtonsSocial() {
  const { t } = useTranslation()
  const user = useUser(state => state.user)

  //`https://${process.env.NEXT_PUBLIC_FRONTEND}/?referral_code=${user?.profile?.referral_code}`

  return (
    <ul className={styles.containerButtons}>
      {
        BUTTONS_SOCIAL({
          url: `https://${process.env.NEXT_PUBLIC_FRONTEND}/?referral_code=${user?.profile?.referral_code}`,
          text: `${user?.profile?.user?.full_name} ${user?.profile?.gender === "female" ? t("invited you to the Spenat service -female") : t("invited you to the Spenat service -male")}`,
        }).map(item => (
          <li
            key={item.link}
            onClick={() => window.open(item.link)}
          >
            <Image
              src={item.icon}
              alt={item.icon}
              width={32}
              height={32}
            />
          </li>
        ))
      }
    </ul>
  )
}