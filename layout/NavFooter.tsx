import { FC, useState } from "react";
import { isMobile } from "react-device-detect";

import type { TMenu } from "types/menu";

import { ITEMS_MENU_FOOTER } from "./constants/ItemsMenuFooter";

const NavFooter: FC = () => {
        const [active, setActive] = useState<TMenu>("home")

        return (
                isMobile
                        ? (
                                <div className="nav-footer-mobile">
                                        {
                                                ITEMS_MENU_FOOTER.map(({ title, value, icon: { fill, regular } }) => (
                                                        <div key={`${value}_menu_items`} className={`item-menu `}>
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