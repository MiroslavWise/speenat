import { Dispatch } from "react"
import type { TMenu } from "types/menu"

export interface IUseMenu {
    current: TMenu

    setCurrent: Dispatch<TMenu>
}
