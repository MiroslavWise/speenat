import { Dispatch, FC, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from "react"

import { URL_SOCKET } from "api/api-general"
import { useAuth } from "store/use-auth"
import { toast } from "react-toastify"
import { useQuery } from "react-query"
import { profileMy } from "api/api-user"
import { useUser } from "store/use-user"

export const ContextWebSocket = createContext<
    | {
          wsChannel: WebSocket | undefined
          setWsChannel: Dispatch<SetStateAction<WebSocket | undefined>>
      }
    | undefined
>(undefined)

export const ProviderWebSocket: FC<{ children: ReactNode }> = ({ children }) => {
    const [webSocket, setWebSocket] = useState<WebSocket | undefined>(undefined)
    const token = useAuth(({ token }) => token)
    const notify = (text: string) =>
        toast(text, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        })

    const { refetch } = useQuery({
        queryFn: () => profileMy(),
        queryKey: ["profile-me", token!],
        enabled: false,
    })

    const connectWebSocket = () => {
        const ws = new WebSocket(URL_SOCKET(token!))

        ws.addEventListener("open", () => {
            console.log("WebSocket connected")
            setWebSocket(ws)
        })

        ws.addEventListener("close", () => {
            console.log("WebSocket disconnected")
            setWebSocket(undefined)
            reconnectWebSocket()
        })

        return ws
    }

    const reconnectWebSocket = () => {
        console.log("Reconnecting WebSocket in 1 second...")
        setTimeout(() => {
            connectWebSocket()
        }, 1000)
    }

    useEffect(() => {
        if (webSocket) {
            webSocket.addEventListener("message", eventMessage)
        }
        return () => webSocket?.removeEventListener("message", eventMessage)
    }, [webSocket])

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

    function eventMessage(event: any) {
        const data = JSON.parse(event.data).data
        if (data?.type === "billing_deposit_up" || data?.type === "billing_declined") {
            console.log("message: ", data?.message)
            const message = data?.message?.verb

            refetch()
            notify(message)
        }
    }

    return (
        <ContextWebSocket.Provider value={{ wsChannel: webSocket, setWsChannel: setWebSocket }}>
            {children}
        </ContextWebSocket.Provider>
    )
}

export const useWeb = () => {
    const context = useContext(ContextWebSocket)

    if (context === undefined) {
        throw new Error("useWebSocket must be used within a WebSocket Provider")
    }

    return context
}
