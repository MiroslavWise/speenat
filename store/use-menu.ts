import { create } from "zustand"
import { persist, createJSONStorage } from 'zustand/middleware'

import type { IUseMenu } from "types/store/menu";



export const useMenu = create(
        persist<IUseMenu>(
                (set, get) => ({
                        current: 'home',

                        setCurrent(value) {
                                set({ current: value })
                        }
                }),
                {
                        name: 'menu-current',
                        storage: createJSONStorage(() => sessionStorage),
                }
        )
)
