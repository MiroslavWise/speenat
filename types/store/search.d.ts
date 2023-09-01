export type TDuration = 20 | 40 | 60
export type TStatusOnline = "" | "online" | "offline" | "busy"
export type TVerified = "" | "yes" | "no"

interface IValue {
    duration: TDuration
    price: [number, number]
    rate: number
    status: TStatusOnline
    verified: TVerified
}

export interface ISearch {
    duration: TDuration
    price: [number, number]
    rate: number
    status: TStatusOnline
    verified: TVerified

    use(value: IValue): void
}
