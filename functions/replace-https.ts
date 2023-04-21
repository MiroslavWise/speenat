


export function replaceHttps(value: string): string {
        if (typeof value === "string") {
                return value?.replace('http:/', 'https:/')
        }
        return ""
}