import { create } from "zustand"

import type { IUseProfiles } from "types/store/profiles"

import { speakers } from "api/api-user"

export const useProfiles = create<IUseProfiles>(
        (set, get) => ({
                profiles: [],
                loading: false,
                total: 0,
                filters: {
                        verified: "",
                        page: 1,
                        price_gte: 0,
                        price_lte: 100000,
                        speaker__status: "online",
                        spec_rating: "",
                },
                getReset() {
                        set({
                                profiles: [],
                                loading: false,
                        })
                },
                getFilter({ verified, price_gte, price_lte, speaker__status, spec_rating, page }) {
                        set({
                                filters: {
                                        verified: verified,
                                        page: page,
                                        price_gte: price_gte,
                                        price_lte: price_lte,
                                        speaker__status: speaker__status,
                                        spec_rating: spec_rating,
                                }
                        })
                }
        })
)