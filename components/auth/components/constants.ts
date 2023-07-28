export interface ILangFlags {
  value: "ru" | "kz" | "en"
  icon: string
}

export const FLAGS_LANGUAGE: ILangFlags[] = [
  {
    value: "ru",
    icon: "/svg/flags/ru.svg",
  },
  {
    value: "kz",
    icon: "/svg/flags/kz.svg",
  },
  {
    value: "en",
    icon: "/svg/flags/us.svg",
  }
]