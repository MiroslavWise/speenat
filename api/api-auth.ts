import axios from "axios"
import { URL } from "./api-general"

interface ILogin{
        email: string
        password: string
}

export interface IRegister{
        full_name: string
        email: string
        password: string
        password2: string
        is_speaker: boolean
        referral_code?: string
        profile: {
                accept_politics: boolean
                accept_public_offer: boolean
        }
}

export const login = async (values: ILogin): Promise<any> => {
        const data = values
        try {
                const response = await fetch(`${URL}/login/`, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                                "Content-Type": "application/json"
                        }
                })

                return response.json()
        } catch (e) {
                console.error(e)
                return e
        }
}

export const refreshToken = async (refresh: string): Promise<any> => {
        try {
                const response = await fetch(`${URL}/login/`, {
                        method: "POST",
                        body: JSON.stringify({ refresh: refresh }),
                        headers: {
                                "Content-Type": "application/json"
                        }
                })
                //access
                return response.json()
        } catch (e) {
                console.error(e)
                return e
        }
}

export const verifyToken = async (token: string): Promise<any> => {
        try {
                const response = await fetch(`${URL}/login/`, {
                        method: "POST",
                        body: JSON.stringify({ token: token }),
                        headers: {
                                "Content-Type": "application/json"
                        }
                })
                return response.json()
        } catch (e) {
                console.error(e)
                return e
        }
}

export const registerUser = async (data: IRegister): Promise<any> => {

        try {
                const response = await fetch(`${URL}/register/`, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                                "Content-Type": "application/json"
                        }
                })

                return response.json()
        } catch (e) {
                console.error(e)
                return e
        }
}