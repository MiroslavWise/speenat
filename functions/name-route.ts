const paths: Record<string, string> = {
        teachers: "Teachers",
        archive: "SessionArchive",
        invited: "Invitation",
        profile: "Profile",
        spec: "Specialization",
        analytics: "Analytics",
        accountant: "Accountant_office",
        'pay-data': 'Payment_details',
        chat: "Chat",
}

const terms: Record<any, string> = {
        general: "Terms_of_use",
        offer: "Public_offer",
        voluntary: "Voluntary_consent",
        'service- rule': "Terms_of_Use",
        'safe-pay': "Online_payments",
}

export const nameRoute = (route: string, t: (value: string) => string, name?: string | undefined): string => {
        const split = route.split('/').filter(_ => _)
        if (split[0] === "chat") {
                if (name) {
                        return name?.replaceAll("_", " ")
                }
                return t("Chat")
        }
        if (split[0] === "profile") {
                if (split?.[1] === "change") {
                        return t("Настройка профиля")
                }
                return t("Profile")
        }
        if (split[0] === "terms") {
                if(terms.hasOwnProperty(split[1])) return t(terms[split[1]])
                return  t("Terms_of_agreements")
        }
        if(paths.hasOwnProperty(split[0])) return t(paths[split[0]])
        return split[0] ? t(split[0]) : ""
}

export const activePath = (route: string, value: string): boolean => route.split('/').filter(_ => _)[0] === value