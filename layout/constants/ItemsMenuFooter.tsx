import { FC, ReactNode } from "react"

import type { TMenu } from "types/menu"

import HomeFill from "@icons-home-fill"
import HomeRegular from "@icons-home-regular"
import UserFill from "@icons-user-fill"
import UserRegular from "@icons-user-regular"

interface IItemMenuFooter{
        title: string
        value: TMenu
        icon: {
                fill: ReactNode
                regular: ReactNode
        }
}

const ITEMS_MENU_FOOTER: IItemMenuFooter[] = [
        {
                title: 'Home',
                value: "home",
                icon: {
                        fill: <HomeFill />,
                        regular: <HomeRegular />
                }
        },
        {
                title: 'Profile',
                value: "profile",
                icon: {
                        fill: <UserFill />,
                        regular: <UserRegular />
                }
        }

]

export { ITEMS_MENU_FOOTER }