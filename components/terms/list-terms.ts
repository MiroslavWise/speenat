export interface IDataTerms{
        label: string
        path: string
        icon: string
}

export const TERMS: IDataTerms[] = [
        {
                label: "Сменить язык",
                path: "language",
                icon: "/svg/terms/type.svg",
        },
        {
                label: "Terms of use",
                path: "/terms/general",
                icon: "/svg/terms/help-square.svg",
        },
        {
                label: "Public offer",
                path: "/terms/offer",
                icon: "/svg/terms/arrows-triangle.svg",
        },
        {
                label: "Voluntary consent",
                path: "/terms/voluntary",
                icon: "/svg/terms/file-check.svg",
        },
        {
                label: "Rules of use",
                path: "/terms/service-rule",
                icon: "/svg/terms/file-shield.svg",
        },
        {
                label: "Online payments",
                path: "/terms/safe-pay",
                icon: "/svg/terms/credit-card-shield.svg",
        },

]