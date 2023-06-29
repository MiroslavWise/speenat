import { FC, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { isMobile } from "react-device-detect";

import type { TMenu } from "types/menu";

import { useUser } from "store/use-user";

import { FIRST_ITEM, CENTRAL_ITEM, LAST_ITEMS } from "./constants/ItemsMenuFooter";
import { activePath } from "functions/name-route";

import styles from "./styles/footer.module.scss"

const activePash = (asPath: string, value: string): boolean => {
        const startPath = asPath.split('/')?.filter(item => item)[0]
        return startPath === value
}

const NavFooter: FC = () => {
        const { push, asPath } = useRouter()
        const isSpeaker = useUser(state => state.is_speaker)

        const handleTo = (path: string) => {
                push(path, undefined, { shallow: true })
        }

        return (
                isMobile
                        ? (
                                <div className={styles.container}>
                                        <ul className={styles.content}>
                                                {
                                                        FIRST_ITEM(isSpeaker).map(item => (
                                                                <li key={`${item?.value}_${item?.title}`} onClick={() => handleTo(`/${item.value}`)}>
                                                                        <div className={styles.contentItem}>
                                                                                <Image
                                                                                        src={activePash(asPath, item.value) ? item.icon.fill : item.icon.regular}
                                                                                        alt={item.value}
                                                                                        width={24}
                                                                                        height={24}
                                                                                />
                                                                                <p style={{ color: activePash(asPath, item.value) ? 'rgb(51,54,124)' : 'rgb(102, 112, 133)' }}>{item.title}</p>
                                                                        </div>
                                                                </li>
                                                        ))
                                                }
                                                <li key={"central"} onClick={() => handleTo(`/${CENTRAL_ITEM(isSpeaker).value}`)}>
                                                        <div className={`${styles.contentItem} ${styles.central}`}>
                                                                <div className={styles.imageCentral}>
                                                                        <Image
                                                                                src="/svg/nav-bar/Polygon.svg"
                                                                                alt="poligon"
                                                                                width={92}
                                                                                height={92}
                                                                        />
                                                                        <Image
                                                                                className={styles.image}
                                                                                src={activePash(asPath,  CENTRAL_ITEM(isSpeaker).value) ?  CENTRAL_ITEM(isSpeaker).icon.fill :  CENTRAL_ITEM(isSpeaker).icon.regular}
                                                                                alt={ CENTRAL_ITEM(isSpeaker).value}
                                                                                width={30}
                                                                                height={30}
                                                                        />
                                                                </div>
                                                                <p style={{ color: activePash(asPath, CENTRAL_ITEM(isSpeaker).value) ? 'rgb(51,54,124)' : 'rgb(102, 112, 133)' }}>{CENTRAL_ITEM(isSpeaker).title}</p>
                                                        </div>
                                                </li>
                                                {
                                                        LAST_ITEMS(isSpeaker).map(item => (
                                                                <li key={`${item?.value}_${item?.title}`} onClick={() => handleTo(`/${item.value}`)}>
                                                                        <div className={styles.contentItem}>
                                                                                <Image
                                                                                        src={activePash(asPath, item.value) ? item.icon.fill : item.icon.regular}
                                                                                        alt={item.value}
                                                                                        width={24}
                                                                                        height={24}
                                                                                />
                                                                                <p style={{ color: activePash(asPath, item.value) ? 'rgb(51,54,124)' : 'rgb(102, 112, 133)' }}>{item.title}</p>
                                                                        </div>
                                                                </li>
                                                        ))
                                                }
                                        </ul>
                                </div>
                        ) : null
        )
}

export default NavFooter