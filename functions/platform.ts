const userAgent = () => {
    if (typeof window !== "undefined") {
        return navigator.userAgent
    }
    return ""
}

export const isSafari = () => !!/Version\/[\d\.]+.*Safari/.exec(userAgent())
export const iOS = () => /iPad|iPhone|iPod/.test(userAgent())
export const Android = () => /Android/.test(userAgent())
export const Linux = () => /Linux/.test(userAgent())
export const Windows = () => /Windows/.test(userAgent())

export const platform = iOS()
    ? "ios"
    : Android()
    ? "android"
    : Linux()
    ? "linux"
    : Windows()
    ? "windows"
    : "ios"
