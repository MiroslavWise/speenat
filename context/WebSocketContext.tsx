import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react"

import { URL_SOCKET } from "api/api-general"
import userData from "helpers/user-data"

export const ContextWebSocket = createContext<{
        wsChannel: WebSocket | undefined
        setWsChannel: Dispatch<SetStateAction<WebSocket | undefined>>
} | undefined>(undefined)

export const ProviderWebSocket: FC<{ children: ReactNode }> = ({ children }) => {
        const [wsChannel, setWsChannel] = useState<WebSocket | undefined>(undefined)

        useEffect(() => {
                let ws: WebSocket;
                const closeWsConnect = () => {
                        setTimeout(createChannel, 5000);
                };
                function createChannel() {
                        ws?.removeEventListener("close", closeWsConnect);
                        ws?.close();
                        if (userData.JWT) {
                                ws = new WebSocket(URL_SOCKET(userData.JWT));
                                ws.onopen = (e) => {
                                        console.log("on open");
                                };
                                ws.onclose = () => {
                                        closeWsConnect();
                                        console.log('on close: ')
                                };
                                setWsChannel(ws);
                        }
                }
                if (userData.isUserOk) {
                        if (userData.JWT) {
                                createChannel();
                        }
                }
                return () => {
                        ws?.removeEventListener("close", closeWsConnect);
                        ws?.close();
                        setWsChannel(undefined)
                };
        }, [userData.JWT])

        return (
                <ContextWebSocket.Provider value={{ wsChannel, setWsChannel }}>
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