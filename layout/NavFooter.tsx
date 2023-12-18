import { FC } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import { useTranslation } from "react-i18next"
import { isMobile } from "react-device-detect"

import { useUser } from "store/use-user"

import { FIRST_ITEM, CENTRAL_ITEM, LAST_ITEMS } from "./constants/ItemsMenuFooter"

import styles from "./styles/footer.module.scss"

const activePash = (asPath: string, value: string): boolean => {
    const startPath = asPath.split("/")?.filter((item) => item)[0]
    return startPath === value
}

const NavFooter: FC = () => {
    const { t } = useTranslation()
    const { push, asPath } = useRouter()
    const isSpeaker = useUser((state) => state.is_speaker)

    const handleTo = (path: string) => {
        push(path, undefined, { shallow: true })
    }

    return isMobile ? (
        <div className={styles.container}>
            <ul>
                {FIRST_ITEM(isSpeaker).map((item) => (
                    <Link key={`${item?.value}_${item?.title}`} href={`/${item.value}`}>
                        <div className={styles.contentItem}>
                            <Image
                                src={activePash(asPath, item.value) ? item.icon.fill : item.icon.regular}
                                alt={item.value}
                                width={24}
                                height={24}
                            />
                            <p
                                style={{
                                    color: activePash(asPath, item.value) ? "rgb(51,54,124)" : "rgb(102, 112, 133)",
                                }}
                            >
                                {t(item.title)}
                            </p>
                        </div>
                    </Link>
                ))}
                <Link key={"central"} href={`/${CENTRAL_ITEM(isSpeaker).value}`}>
                    <div className={`${styles.contentItem} ${styles.central}`}>
                        <div className={styles.imageCentral}>
                            <Image src="/svg/nav-bar/Polygon.svg" alt="poligon" width={92} height={92} />
                            <Image
                                className={styles.image}
                                src={
                                    activePash(asPath, CENTRAL_ITEM(isSpeaker).value)
                                        ? CENTRAL_ITEM(isSpeaker).icon.fill
                                        : CENTRAL_ITEM(isSpeaker).icon.regular
                                }
                                alt={CENTRAL_ITEM(isSpeaker).value}
                                width={30}
                                height={30}
                            />
                        </div>
                    </div>
                </Link>
                {LAST_ITEMS(isSpeaker).map((item) => (
                    <Link key={`${item?.value}_${item?.title}`} href={`/${item.value}`}>
                        <div className={styles.contentItem}>
                            <Image
                                src={activePash(asPath, item.value) ? item.icon.fill : item.icon.regular}
                                alt={item.value}
                                width={24}
                                height={24}
                            />
                            <p
                                style={{
                                    color: activePash(asPath, item.value) ? "rgb(51,54,124)" : "rgb(102, 112, 133)",
                                }}
                            >
                                {t(item.title)}
                            </p>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    ) : null
}

export default NavFooter
