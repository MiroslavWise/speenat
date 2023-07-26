import type { TMenu } from "types/menu"

interface IItemMenuFooter {
        title: string
        value: TMenu
        icon: {
                fill: string
                regular: string
        }
}

export const FIRST_ITEM = (isSpeaker: boolean): IItemMenuFooter[] => [
        {
                title: isSpeaker ? 'Specialization' : 'Archive',
                value: isSpeaker ? 'spec' : 'archive',
                icon: {
                        fill: isSpeaker ? '/svg/nav-bar/file-fill.svg' : '/svg/nav-bar/backpack-fill.svg',
                        regular: isSpeaker ? '/svg/nav-bar/file-gray.svg' : '/svg/nav-bar/backpack-gray.svg',
                },
        },
        {
                title: 'Balance',
                value: 'pay-data',
                icon: {
                        fill: '/svg/nav-bar/creadit-fill.svg',
                        regular: '/svg/nav-bar/creadit-gray.svg',
                }
        },
]

export const LAST_ITEMS = (isSpeaker: boolean): IItemMenuFooter[] => [
        {
                title: 'Chat',
                value: 'chat',
                icon: {
                        fill: '/svg/nav-bar/message-chat-fill.svg',
                        regular: '/svg/nav-bar/message-chat-gray.svg',
                }
        },
        {
                title: 'Profile',
                value: 'profile',
                icon: {
                        fill: '/svg/nav-bar/user-star-fill.svg',
                        regular: '/svg/nav-bar/user-star-gray.svg',
                }
        }
]

export const CENTRAL_ITEM = (isSpeaker: boolean): IItemMenuFooter => (
        isSpeaker ? (
                {
                        title: 'Archive',
                        value: 'archive',
                        icon: {
                                fill: '/svg/nav-bar/backpack-white.svg',
                                regular: '/svg/nav-bar/backpack-white.svg',
                        }
                }
        ) : (
                {
                        title: 'Search',
                        value: 'teachers',
                        icon: {
                                fill: '/svg/nav-bar/graduation-white.svg',
                                regular: '/svg/nav-bar/graduation-white.svg',
                        }
                }
        )
)