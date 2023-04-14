import { create } from "zustand";

import { IUserStore } from "types/store/user";

export const useUser = create<IUserStore>(
        (set, get) => ({
                user: undefined,
                loading: false,

                getUserData() {
                        set({
                                user: undefined,
                                loading: false,
                        })
                        
                },
        })
)