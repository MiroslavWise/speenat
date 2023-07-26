import { ReactNode } from "react"



export interface IDataTerms{
        label: string
        path: string
        icon: ReactNode
}

export const TERMS: IDataTerms[] = [
        {
                label: "Terms of use",
                path: "/terms/general",
                icon: null,
        },
        {
                label: "Public offer",
                path: "/terms/offer",
                icon: null,
        },
        {
                label: "Voluntary consent",
                path: "/terms/voluntary",
                icon: null,
        },
        {
                label: "Rules of use",
                path: "/terms/service-rule",
                icon: null,
        },
        {
                label: "Online payments",
                path: "/terms/safe-pay",
                icon: null,
        },
]