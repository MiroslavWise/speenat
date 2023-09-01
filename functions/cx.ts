export const cx = (...classes: any[]): string =>
    classes
        .flat()
        .filter((item) => typeof item === "string")
        .join(" ")
