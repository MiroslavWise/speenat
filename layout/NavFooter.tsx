import { FC, useState } from "react";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

import type { TMenu } from "types/menu";

import { useUser } from "store/use-user";

import { ITEMS_MENU_FOOTER } from "./constants/ItemsMenuFooter";
import { activePath } from "functions/name-route";

const NavFooter: FC = () => {
        const { push, asPath } = useRouter()
        const isSpeaker = useUser(state => state.is_speaker)
        const [active, setActive] = useState<TMenu>("home")

        const handleTo = (path: string) => {
                push(path, undefined, { shallow: true })
        }

        return (
                isMobile
                        ? (
                                <div className="nav-footer-mobile">
                                        {
                                                ITEMS_MENU_FOOTER(isSpeaker).map(({ title, value, icon: { fill, regular } }) => (
                                                        <div
                                                                key={`${value}_menu_items`}
                                                                className={`item-menu `}
                                                                onClick={() => handleTo(`/${value}`)}
                                                                
                                                        >
                                                                {activePath(asPath, value) ? regular: fill}
                                                                <p>{title}</p>
                                                        </div>
                                                ))
                                        }
                                </div>
                        ) : null
        )
}

export default NavFooter