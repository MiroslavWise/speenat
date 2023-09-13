export type TDuration = 20 | 40 | 60
export type TStatusOnline = "" | "online" | "offline" | "busy"
export type TVerified = "" | "yes" | "no"
export type TPriceOffer = "economy" | "business" | "premium" | "vip" | null

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
    priceOffer: TPriceOffer

    usePriceOffer(value: TPriceOffer): void
    use(value: IValue): void
}
