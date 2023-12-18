import { create } from "zustand"

export const useDeleteAccount = create<{ visible: boolean }>((set, get) => ({
    visible: false,
}))

export const dispatchDeleteAccount = (value: boolean) => useDeleteAccount.setState(() => ({ visible: value }))
