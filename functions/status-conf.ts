import { TStatusCall } from "types/store/user"

export const statusCallConf = (value: TStatusCall) => {
        const object: Record<TStatusCall, { title: string, color: string }> = {
                CALL_END: {
                        title: "Completed",
                        color: "green",
                },
                COMPLETED_AHEAD: {
                        title: "Completed ahead of schedule",
                        color: "red"
                }
        }

        return object[value]
}