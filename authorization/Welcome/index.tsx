import { useState } from "react"
import { cx } from "functions/cx"
import styles from "./style.module.scss"
import Image from "next/image"
import { useTranslation } from "react-i18next"

export function Welcome() {
    const { t } = useTranslation()
    const [visible, setVisible] = useState(true)

    return (
        <div className={cx(styles.wrapper, visible && styles.visible)}>
            <div className={styles.container}>
                <Image src="/png/fococlipping-HD.png" alt="welcome" width={376} height={214} unoptimized />
                <div className={styles.content}>
                    <h2>
                        {t("Welcome to our family")} <span>SPENAT</span>
                    </h2>
                    <p>
                        {t("Create your language path by choosing from a wide range of available languages, including")}{" "}
                        <span>{t("Kazakh, English, Spanish, French, German")}</span>{" "}
                        {t(
                            "and many others. Our teachers are real experts with rich experience and understanding of the unique features of each language.",
                        )}
                    </p>
                </div>
            </div>
            <div className={styles["button-container"]}>
                <div className={styles.button} onClick={() => setVisible(false)}>
                    <p>Продолжить</p>
                </div>
            </div>
        </div>
    )
}
