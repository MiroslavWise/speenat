import { type DispatchWithoutAction } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware'
import * as jwt from "jsonwebtoken"

import { login, refreshToken } from "api/api-auth"


export type TAuthContext = 'SignIn' | 'Main' | 'Gates'

interface IUseAuth {
  state?: TAuthContext
  token: string | undefined
  refreshToken: string | undefined
  expiration: number | undefined

  login?: (values: ILogin) => Promise<IReturnDataAuthToken>
  checkAuth?: () => Promise<IReturnDataAuthToken>
  out?: DispatchWithoutAction
}

interface ILogin {
  email: string
  password: string
}

interface IReturnDataAuthToken {
  ok: boolean
}

export const useAuth = create(
  persist<IUseAuth>((set, get) => ({
    state: "Gates",
    token: undefined,
    refreshToken: undefined,
    expiration: undefined,

    async login({ email, password }) {
      try {
        const data = await login({ email: email, password: password })
        const { access, refresh } = data ?? {}
        const expiration = decodeJwt(access)
        if (access && refresh) {
          set({
            token: access,
            refreshToken: refresh,
            expiration: expiration,
            state: "Main",
          })
          return {
            ok: true,
          }
        }
        return {
          ok: false,
        }
      } catch (e) {
        console.info("---ERROR LOGIN--- ", e)
        return {
          ok: false,
        }
      }
    },
    async checkAuth() {
      try {
        if (!isTokenExpired(get().expiration) && typeof get().expiration === "number") {
          set({
            state: "Main",
          })
          return {
            ok: true,
          }
        }
        if (typeof get().refreshToken !== "string") {
          set({
            token: undefined,
            refreshToken: undefined,
            expiration: undefined,
            state: "SignIn",
          })
          return {
            ok: false,
          }
        }
        if (typeof get().expiration === "number" && isTokenExpired(get().expiration) && typeof get().refreshToken === "string") {
          const data = await refreshToken(get().refreshToken!)
          const { access } = data ?? {}
          const expiration = decodeJwt(access)
          if (access) {
            set({
              state: "Main",
              token: access,
              expiration: expiration,
            })
            return {
              ok: true,
            }
          }
          return {
            ok: false,
          }
        }
        return {
          ok: false
        }
      } catch (e) {
        console.warn("---ERROR UPDATE REFRESH TOKEN OR TOKEN--- ", e)
        set({
          token: undefined,
          refreshToken: undefined,
          expiration: undefined,
          state: "SignIn",
        })
        return {
          ok: false,
        }
      }
    },
    out() {
      set({
        state: "SignIn",
        token: undefined,
        refreshToken: undefined,
        expiration: undefined,
      })
    },
  }),
    {
      name: 'auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken, expiration: state.expiration }),
    }
  )
)










function decodeJwt(token: string): number | undefined {
  try {
    const decodedPayload: any = jwt.decode(token, { complete: true })
    const expirationTime: number | undefined = decodedPayload?.payload?.exp

    if (expirationTime !== undefined) {
      return expirationTime
    }
  } catch (error) {
    console.error('Error decoding JWT:', error)
    return undefined
  }

  return undefined
}

function isTokenExpired(exp: number | undefined) {
  if (exp !== undefined) {
    const currentTime: number = Math.floor(Date.now() / 1000)

    console.log("exp: ", exp, "currentTime: ", currentTime)
    return exp < currentTime
  }
}