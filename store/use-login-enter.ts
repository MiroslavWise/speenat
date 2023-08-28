import { type DispatchWithoutAction, type Dispatch } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'

interface IUseLoginEnter {
  active: boolean | undefined

  setActive: Dispatch<boolean>
}

export const useLoginEnter = create(
  persist<IUseLoginEnter>(
    (set, get) => ({
      active: undefined,

      setActive(value) {
        set({ active: value, })
      },
    }),
    {
      name: 'enter',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
)