import type { TDuration, TStatusOnline, TVerified } from "types/store/search"

interface IStatus {
        value: TStatusOnline
        label: string
}

interface IVerified{
        value: boolean | ""
        label: string
}

const STATUS_ONLINE: IStatus[] = [
        {
                value: "",
                label: "Все", 
        },
        {
                value: "online",
                label: "Online",
        },
        {
                value: "offline",
                label: "Offline",
        },
        {
                value: "busy",
                label: "Busy",
        }
]
const DURATION: TDuration[] = [20, 40, 60]
const VERIFIED: IVerified[] = [
        {
                value: "",
                label: "Все",
        },
        {
                value: true,
                label: "Да",
        },
        {
                value: false,
                label: "No",
        }
]

export { DURATION, STATUS_ONLINE, VERIFIED }