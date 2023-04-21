import { FC, ReactNode } from "react"

import type { TMenu } from "types/menu"

import HomeFill from "@icons-home-fill"
import HomeRegular from "@icons-home-regular"
import UserFill from "@icons-user-fill"
import UserRegular from "@icons-user-regular"
import Archive from "@icons-archive"
import BookContent from "@icons-book-content"
import ArchiveFill from "@icons-archive-fill"
import BookContentFill from "@icons-book-content-fill"
import CreditCardAlt from "@icons-credit-card-alt"
import CreditCardAltFill from "@icons-credit-card-alt-fill"

interface IItemMenuFooter{
        title: string
        value: TMenu
        icon: {
                fill: ReactNode
                regular: ReactNode
        }
}

const ITEMS_MENU_FOOTER = (isSpeaker: boolean): IItemMenuFooter[] => ([
        {
                title: 'Home',
                value: "",
                icon: {
                        fill: <HomeFill />,
                        regular: <HomeRegular  fill="#fff" />
                }
        },
        {
                title: "Balance",
                value: "pay-data",
                icon: {
                        fill: <CreditCardAltFill />,
                        regular: <CreditCardAlt />
                }
        },
        {
                title: isSpeaker ? "Spec" : "Archive",
                value: isSpeaker ? 'spec' : 'archive',
                icon: {
                        fill: isSpeaker ? <BookContentFill /> : <ArchiveFill />,
                        regular: isSpeaker ? <BookContent fill="#fff" /> : <Archive fill="#fff" />,
                }
        },
        {
                title: 'Profile',
                value: "profile",
                icon: {
                        fill: <UserFill />,
                        regular: <UserRegular fill="#fff" />
                }
        }
])

export { ITEMS_MENU_FOOTER }