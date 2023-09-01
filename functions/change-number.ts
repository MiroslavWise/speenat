export function changeNumber(number: string): string {
    if (typeof number !== "string") return ""
    const regex = /(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/g
    const subst = "+$1 ($2) $3-$4-$5"
    return number.replace(regex, subst)
}
