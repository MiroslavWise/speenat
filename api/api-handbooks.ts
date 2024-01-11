import { axiosInstance } from "./api-general"

interface IReturnDataHandbooks {
    count: number
    results: {
        id: number | string
        name: string
    }[]
}

export const topicHandbooks = async (page?: number): Promise<IReturnDataHandbooks> => {
    return axiosInstance
        .get(`/topic-list/`)
        .then((response) => response.data)
        .catch((error) => {
            throw new Error(error)
        })
}

topicHandbooks()
    .then((data) => {
        console.log("Результат запроса:", data)
    })
    .catch((error) => {
        console.error("Ошибка запроса:", error)
    })
