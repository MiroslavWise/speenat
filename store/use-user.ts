import { create } from "zustand"

import type { IUser, IUserStore } from "types/store/user"
import { profileMy } from "api/api-user"

export const useUser = create<IUserStore>(
        (set, get) => ({
                user: undefined,
                loading: false,
                is_speaker: false,
                is_superuser: false,
                is_admin: false,
                is_staff: false,
                is_active: false,

                getUserData() {
                        set({ loading: true })
                        profileMy()
                                .then((response: IUser) => {
                                        set({
                                                user: response,
                                                is_speaker: response?.user?.is_speaker,
                                                is_superuser: response?.user?.is_superuser,
                                                is_admin: response?.user?.is_admin,
                                                is_staff: response?.user?.is_staff,
                                                is_active: response?.user?.is_active,
                                                loading: false,
                                        })
                                })
                },
                getReset() {
                        set({
                                user: undefined,
                                loading: false,
                                is_speaker: false,
                                is_superuser: false,
                                is_admin: false,
                                is_staff: false,
                                is_active: false,
                        })
                }
        })
)