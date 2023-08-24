import { useState } from "react"

import { cx } from "functions/cx"

import styles from "./style.module.scss"
import Image from "next/image"

export function Welcome() {
  const [visible, setVisible] = useState(true)

  return (
    <div className={cx(styles.wrapper, visible && styles.visible)}>
      <div className={styles.container}>
        <Image
          src="/png/fococlipping-HD.png"
          alt="welcome"
          width={376}
          height={214}
          unoptimized
        />
        <h2>Добро пожаловать в нашу семью <span>SPENAT</span></h2>
        <p>Создайте свой языковой путь, выбрав из широкого спектра доступных языков, включая английский, испанский, французский, немецкий и многие другие. Наши преподаватели - настоящие эксперты, обладающие богатым опытом и пониманием уникальных особенностей каждого языка.</p>
      </div>
      <div className={styles["button-container"]}>
        <div className={styles.button} onClick={() => setVisible(false)}>
          <p>Продолжить</p>
        </div>
      </div>
    </div>
  )
}