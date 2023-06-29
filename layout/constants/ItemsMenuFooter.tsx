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
                title: isSpeaker ? 'Специаль...' : 'Архив',
                value: isSpeaker ? 'spec' : 'archive',
                icon: {
                        fill: isSpeaker ? '/svg/nav-bar/file-fill.svg' : '/svg/nav-bar/backpack-fill.svg',
                        regular: isSpeaker ? '/svg/nav-bar/file-gray.svg' : '/svg/nav-bar/backpack-gray.svg',
                },
        },
        {
                title: 'Баланс',
                value: 'pay-data',
                icon: {
                        fill: '/svg/nav-bar/creadit-fill.svg',
                        regular: '/svg/nav-bar/creadit-gray.svg',
                }
        },
]

export const LAST_ITEMS = (isSpeaker: boolean): IItemMenuFooter[] => [
        {
                title: 'Чат',
                value: 'chat',
                icon: {
                        fill: '/svg/nav-bar/message-chat-fill.svg',
                        regular: '/svg/nav-bar/message-chat-gray.svg',
                }
        },
        {
                title: 'Профиль',
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
                        title: 'Архив',
                        value: 'archive',
                        icon: {
                                fill: '/svg/nav-bar/backpack-white.svg',
                                regular: '/svg/nav-bar/backpack-white.svg',
                        }
                }
        ) : (
                {
                        title: 'Поиск',
                        value: 'teachers',
                        icon: {
                                fill: '/svg/nav-bar/graduation-white.svg',
                                regular: '/svg/nav-bar/graduation-white.svg',
                        }
                }
        )
)