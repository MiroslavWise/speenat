import { ReactNode } from "react"



export interface IDataTerms{
        label: string
        path: string
        icon: ReactNode
}

export const TERMS: IDataTerms[] = [
        {
                label: "Условия использования",
                path: "/terms/general",
                icon: null,
        },
        {
                label: "Публичная оферта",
                path: "/terms/offer",
                icon: null,
        },
        {
                label: "Добровольное согласие",
                path: "/terms/voluntary",
                icon: null,
        },
        {
                label: "Правила пользования",
                path: "/terms/service-rule",
                icon: null,
        },
        {
                label: "Онлайн платежи",
                path: "/terms/safe-pay",
                icon: null,
        },
]