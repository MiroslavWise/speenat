import { create } from "zustand"

interface IUseModal {
    active: boolean

    setActive(value: boolean): void
}

export const useModal = create<IUseModal>((set, get) => ({
    active: false,

    setActive(value) {
        set({ active: value })
    },
}))
