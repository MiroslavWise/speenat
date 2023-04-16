import { create } from "zustand"

import type { ISearch } from "types/store/search"

export const useSearch = create<ISearch>(
        (set, get) => ({
                duration: 20,
                price: [0, 100000],
                rate: 0,
                status: 'online',
                verified: "yes",

                use(value) {
                        set({
                                duration: value.duration || get().duration,
                                price: value.price || get().price,
                                rate: value.rate || get().rate,
                                status: value.status || get().status,
                                verified: value.verified || get().verified,
                        })
                },
        })
)