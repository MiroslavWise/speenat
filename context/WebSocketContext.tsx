import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react"

import { URL_SOCKET } from "api/api-general"
import userData from "helpers/user-data"

export const ContextWebSocket = createContext<{
        wsChannel: WebSocket | undefined
        setWsChannel: Dispatch<SetStateAction<WebSocket | undefined>>
} | undefined>(undefined)

export const ProviderWebSocket: FC<{ children: ReactNode }> = ({ children }) => {
        const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined)

        const eventOpen = (event: any) => {
                console.log('WebSocket connected', event)
        }

        const connectWebSocket = () => {
                const ws = new WebSocket(URL_SOCKET(userData.JWT))
                return ws
        }

        const reconnectWebSocket = () => {
                console.log('Reconnecting WebSocket in 1 second...')
                if (userData.JWT) {
                        setTimeout(() => {
                                connectWebSocket()
                        }, 1000)
                }
        }

        useEffect(() => {
                setWebSocket(connectWebSocket())
                webSocket?.addEventListener("open", eventOpen)
                webSocket?.addEventListener("close", reconnectWebSocket)

                return () => {
                        webSocket?.close()
                        webSocket?.removeEventListener("close", reconnectWebSocket)
                        webSocket?.removeEventListener("open", eventOpen)
                        setWebSocket(undefined)
                }
        }, [userData.JWT])

        return (
                <ContextWebSocket.Provider value={{ wsChannel: webSocket, setWsChannel: setWebSocket }}>
                        {children}
                </ContextWebSocket.Provider>
        )
}

export const useWeb = () => {
        const context = useContext(ContextWebSocket)

        if (context === undefined) {
                throw new Error('useWebSocket must be used within a WebSocket Provider')
        }

        return context
}