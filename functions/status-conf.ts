import { TStatusCall } from "types/store/user"

export const statusCallConf = (value: TStatusCall) => {
        const object: Record<TStatusCall, { title: string, color: string }> = {
                CALL_END: {
                        title: "Завершено",
                        color: "green",
                },
                COMPLETED_AHEAD: {
                        title: "Досрочно завершено",
                        color: "red"
                }
        }

        return object[value]
}