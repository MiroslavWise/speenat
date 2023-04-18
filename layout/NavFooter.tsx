import { FC, useState } from "react";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";

import type { TMenu } from "types/menu";

import { ITEMS_MENU_FOOTER } from "./constants/ItemsMenuFooter";

const NavFooter: FC = () => {
        const { push } = useRouter()
        const [active, setActive] = useState<TMenu>("home")

        const handleTo = (path: string) => {
                push(path, undefined, { shallow: true })
        }

        return (
                isMobile
                        ? (
                                <div className="nav-footer-mobile">
                                        {
                                                ITEMS_MENU_FOOTER.map(({ title, value, icon: { fill, regular } }) => (
                                                        <div
                                                                key={`${value}_menu_items`}
                                                                className={`item-menu `}
                                                                onClick={() => handleTo(`/${value}`)}
                                                        >
                                                                {fill}
                                                                <p>{title}</p>
                                                        </div>
                                                ))
                                        }
                                </div>
                        ) : null
        )
}

export default NavFooter