const paths: Record<string, string> = {
        teachers: "Преподаватели",
        archive: "Архив сессий",
        invited: "Приглашение",
        profile: "Профиль",
        spec: "Специализация",
        analytics: "Аналитика",
        accountant: "Кабинет бухгалтера",
        'pay-data': 'Платёжные данные',
}

const terms: Record<any, string> = {
        general: "Условия использования",
        offer: "Публичная оферта",
        voluntary: "Добровольное согласие",
        'service- rule': "Правила пользования",
        'safe-pay': "Онлайн платежи",
}

export const nameRoute = (route: string): string => {
        const split = route.split('/').filter(_ => _)
        if (split[0] === "terms") {
                if(terms.hasOwnProperty(split[1])) return terms[split[1]]
                return  "Условия соглашений"
        }
        if(paths.hasOwnProperty(split[0])) return paths[split[0]]
        return split[0] || ""
}

export const activePath = (route: string, value: string): boolean => route.split('/').filter(_ => _)[0] === value