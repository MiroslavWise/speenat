import { create } from "zustand"

import type { ISearch } from "types/store/search"

export const useSearch = create<ISearch>((set, get) => ({
    duration: 20,
    price: [0, 100_000],
    rate: 0,
    status: "online",
    verified: "yes",
    priceOffer: null,

    usePriceOffer(value) {
        if (value === null) {
            set({ price: [0, 100_000], priceOffer: value })
        }
        if (value === "economy") {
            set({ price: [0, 1_000], priceOffer: value })
        }
        if (value === "business") {
            set({ price: [1_001, 4_000], priceOffer: value })
        }
        if (value === "premium") {
            set({ price: [4_001, 8_000], priceOffer: value })
        }
        if (value === "vip") {
            set({ price: [8_001, 100_000], priceOffer: value })
        }
    },
    use(value) {
        set({
            duration: value.duration || get().duration,
            price: value.price || get().price,
            rate: value.rate || get().rate,
            status: value.status || get().status,
            verified: value.verified || get().verified,
        })
    },
}))
