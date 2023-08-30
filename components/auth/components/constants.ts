export interface ILangFlags {
  value: "ru" | "kz" | "en"
  icon: string
  label: string
}

export const FLAGS_LANGUAGE: ILangFlags[] = [
  {
    value: "ru",
    icon: "/svg/flags/ru.svg",
    label: "Русский",
  },
  {
    value: "kz",
    icon: "/svg/flags/kz.svg",
    label: "Казахский",
  },
  {
    value: "en",
    icon: "/svg/flags/us.svg",
    label: "English",
  }
]