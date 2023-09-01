import { URL } from "api/api-general"

export function replaceHttps(value: string): string {
    if (typeof value === "string") {
        if (value?.split("/").filter((i) => i)?.[0] === "media")
            return `${URL.replace("/api/v1", "")}${value}`
        return value?.replace("http:/", "https:/")
    }
    return ""
}
