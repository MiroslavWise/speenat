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
                label: "Онлайн",
        },
        {
                value: "offline",
                label: "Не в сети",
        },
        {
                value: "busy",
                label: "Занят",
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
                label: "Нет",
        }
]

export { DURATION, STATUS_ONLINE, VERIFIED }