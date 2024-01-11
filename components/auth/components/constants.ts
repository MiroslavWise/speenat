export interface ILangFlags {
    value: "ru" | "kz" | "en"
    icon: string
    label: string
}

export const FLAGS_LANGUAGE: ILangFlags[] = [
    {
        value: "ru",
        icon: "РУ",
        label: "Русский",
    },
    {
        value: "kz",
        icon: "ҚАЗ",
        label: "Казахский",
    },
    {
        value: "en",
        icon: "EN",
        label: "English",
    },
]
