import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react"

import { URL_SOCKET } from "api/api-general"
import { useAuth } from "store/use-auth"

export const ContextWebSocket = createContext<{
        wsChannel: WebSocket | undefined
        setWsChannel: Dispatch<SetStateAction<WebSocket | undefined>>
} | undefined>(undefined)

export const ProviderWebSocket: FC<{ children: ReactNode }> = ({ children }) => {
        const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined)
        const { token } = useAuth(state => ({ token: state.token }))

        const connectWebSocket = () => {
                const ws = new WebSocket(URL_SOCKET(token!))

                ws.addEventListener('open', () => {
                        console.log('WebSocket connected')
                        setWebSocket(ws)
                });

                ws.addEventListener('close', () => {
                        console.log('WebSocket disconnected')
                        setWebSocket(undefined)
                        reconnectWebSocket()
                });

                return ws
        }

        const reconnectWebSocket = () => {
                console.log('Reconnecting WebSocket in 1 second...')
                setTimeout(() => {
                        connectWebSocket()
                }, 1000)
        }

        useEffect(() => {
                const ws = connectWebSocket()

                return () => {
                        if (ws) {
                                ws.close()
                        }
                        if (webSocket) {
                                webSocket?.close()
                                setWebSocket(undefined)
                        }
                }
        }, [])

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