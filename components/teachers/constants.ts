import type { TDuration, TStatusOnline, TVerified } from "types/store/search"

interface IStatus {
    value: TStatusOnline
    label: string
}

interface IVerified {
    value: boolean | ""
    label: string
}

const STATUS_ONLINE: IStatus[] = [
    {
        value: "",
        label: "All",
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
    },
]
const DURATION: TDuration[] = [20, 40, 60]
const VERIFIED: IVerified[] = [
    {
        value: "",
        label: "All",
    },
    {
        value: true,
        label: "Yes",
    },
    {
        value: false,
        label: "No",
    },
]

export { DURATION, STATUS_ONLINE, VERIFIED }