const name_work_years = (year: number) => {
        let years = Number(year)
        if([1, 21, 31, 41].includes(years)) return 'год'
        if(years >=2 && years <= 4 || years >=22 && years <= 24 || years >=32 && years <= 34) return 'года'
        if(years >=5 && years <= 20 || years >=25 && years <= 30 || years >=35 && years <= 40) return 'лет'
        return 'лет'
}

export const work_experience = (work_exp: number) => {
        let exp = Number(work_exp)
        if(exp > 10) return 'Опыт работы более 10 лет'
        if(exp >=5) return 'Опыт работы более 5 лет'
        return `Опыт работы ${exp} ${name_work_years(exp)}`
}