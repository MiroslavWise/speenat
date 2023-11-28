import { Dispatch } from "react"
import { create } from "zustand"

export const useVisibleModalReferral = create<TType>((set, get) => ({
    visible: false,

    dispatchVisibleReferral({ visible, text }) {
        if (visible && text) {
            set({ visible, text })
        } else if (!visible) {
            set({ visible, text: undefined })
        }
    },
}))

interface IState {
    visible: boolean
    text?: string
}

interface IAction {
    dispatchVisibleReferral: Dispatch<{
        visible: boolean
        text?: string
    }>
}

type TType = IState & IAction
