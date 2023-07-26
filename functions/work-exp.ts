const name_work_years = (year: number, t: (value: string) => string) => {
        let years = Number(year)
        if ([1, 21, 31, 41].includes(years)) return `${t("year")}`
        if(years >=2 && years <= 4 || years >=22 && years <= 24 || years >=32 && years <= 34) return `${t("years")}`
        if(years >=5 && years <= 20 || years >=25 && years <= 30 || years >=35 && years <= 40) return `${t('лет')}`
        return 'лет'
}

export const work_experience = (work_exp: number, t: (value: string) => string) => {
        let exp = Number(work_exp)
        if(exp > 10) return `${t("Work experience more than")} 10 лет`
        if(exp >=5) return `${t("Work experience more than")} более 5 лет`
        return `${t("Work experience")} ${exp} ${name_work_years(exp, t)}`
}