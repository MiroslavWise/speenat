import { create } from "zustand"

import type { IUseProfiles } from "types/store/profiles"

export const useProfiles = create<IUseProfiles>((set, get) => ({
    profiles: [],
    loading: false,
    total: 0,
    priceOffer: null,
    filters: {
        verified: "",
        page: 1,
        price_gte: 0,
        price_lte: 100000,
        speaker__status: "online",
        topic_conversation: [],
    },
    usePriceOffer(value) {
        let price: [number, number] = [0, 100_000]
        if (value === null) {
        }
        if (value === "economy") {
            price = [0, 1_000]
        }
        if (value === "business") {
            price = [1_001, 4_000]
        }
        if (value === "premium") {
            price = [4_001, 8_000]
        }
        if (value === "vip") {
            price = [8_001, 100_000]
        }
        set({
            filters: {
                ...get().filters,
                price_gte: price[0],
                price_lte: price[1],
            },
            priceOffer: value,
        })
    },
    getReset() {
        set({
            profiles: [],
            loading: false,
        })
    },
    getFilter({ verified, price_gte, price_lte, speaker__status, topic_conversation, page }) {
        set({
            filters: {
                verified: verified,
                page: page,
                price_gte: price_gte,
                price_lte: price_lte,
                speaker__status: speaker__status,
                topic_conversation: topic_conversation,
            },
        })
    },
}))
