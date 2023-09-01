import { create } from "zustand"

import type { IUser, IUserStore } from "types/store/user"
import { profileMy } from "api/api-user"
import { updateStatus } from "api/api-status"

export const useUser = create<IUserStore>((set, get) => ({
    user: undefined,
    loading: false,
    is_speaker: false,
    is_superuser: false,
    is_admin: false,
    is_staff: false,
    is_active: false,

    getUserData(value = false) {
        set({ loading: value })
        profileMy().then((response: IUser) => {
            set({
                user: response,
                is_speaker: response?.profile?.user?.is_speaker,
                is_superuser: response?.profile?.user?.is_superuser,
                is_admin: response?.profile?.user?.is_admin,
                is_staff: response?.profile?.user?.is_staff,
                is_active: response?.profile?.user?.is_active,
                loading: false,
            })
        })
    },
    getReset() {
        return Promise.all([
            get().is_speaker ? updateStatus("offline") : Promise.resolve(true),
            Promise.resolve(
                set({
                    user: undefined,
                    loading: false,
                    is_speaker: false,
                    is_superuser: false,
                    is_admin: false,
                    is_staff: false,
                    is_active: false,
                }),
            ),
        ])
    },
}))
