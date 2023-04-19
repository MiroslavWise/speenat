export const nameRoute = (route: string): string => {
        const split = route.split('/').filter(_ => _)

        if (split[0] === "terms") {
                if (split[1] === "general") return "Условия использования"
                if (split[1] === "offer") return "Публичная оферта"
                if (split[1] === "voluntary") return "Добровольное согласие"
                if (split[1] === "service-rule") return "Правила пользования"
                if (split[1] === "safe-pay") return "Онлайн платежи"
        }
        if (split[0] === "teachers") return "Преподаватели"
        if (split[0] === "archive") return "Архив сессий"
        if (split[0] === "invited") return "Пригласить друга"
        if (split[0] === "profile") return "Профиль"
        if(split[0] === "spec") return "Специализация"
        
        return split[0] || ""
}

export const activePath = (route: string, value: string): boolean => route.split('/').filter(_ => _)[0] === value