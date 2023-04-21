import { FC, ReactNode, createContext, useEffect } from "react";

import { useWeb } from "./WebSocketContext";

export const CreateJanusContext = createContext(null)


export const ProviderJanusContext: FC<{ children: ReactNode }> = ({ children }) => {
        const { lastMessage } = useWeb()

        return (
                <CreateJanusContext.Provider value={null}>
                        {children}
                </CreateJanusContext.Provider>
        )
}