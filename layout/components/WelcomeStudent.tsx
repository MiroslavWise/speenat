import { useRouter } from "next/router"
import { type FC, type Dispatch, type SetStateAction } from "react"

import styles from "./welcome.module.scss"
import { cx } from "functions/cx"
import Image from "next/image"
import { useLoginEnter } from "store/use-login-enter"
import { useTranslation } from "react-i18next"

export const WelcomeStudent: FC = () => {
  const { t } = useTranslation()
  const { push } = useRouter()
  const { active, set } = useLoginEnter(state => ({ set: state.setActive, active: state.active }))

  function handleClickToSearch() {
    set(false)
    push("/teachers")
  }

  return (
    <div className={cx(styles.wrapper, active && styles.active)}>
      <header>
        <Image
          src="/svg/search-teacher-illustration.svg"
          alt="search-teacher-illustration"
          height={739}
          width={739}
        />
      </header>
      <section>
        <p>{t("Welcome to Spinach, a communication and learning platform. Ready to start? Use")} <span onClick={handleClickToSearch}>{t("search_")}</span>, {t("to find topics and interlocutors that interest you")}!</p>
      </section>
      <footer>
        <div className={styles.button} onClick={handleClickToSearch}>
          <p>{t("Search")}</p>
        </div>
      </footer>
    </div>
  )
}