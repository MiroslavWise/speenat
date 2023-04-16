import axios from "axios"

import { URL } from "./api-general"

interface ILogin{
        email: string
        password: string
}

export const login = async (values: ILogin): Promise<any> => {
        const data = values
        console.log('data: ', data)
        try {
                const response = await fetch(`${URL}/login/`, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                                "Content-Tpe": "application/json"
                        }
                })

                return response.json()
        } catch (e) {
                console.error(e)
                return e
        }
}