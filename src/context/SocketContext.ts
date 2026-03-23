import {createContext, useContext} from "react";
import type {ResourceType} from "../types/remote.ts";

export type SocketContextType = {
    host?: string | null;
    port: number;
    username?: string | null;
    password?: string | null;
    connected: boolean;
    isConnecting: boolean;
    error: string | null;
    setConnectionParams: (host: string | null, port: number | null) => void;
    setCredentials: (username: string | null, password: string | null) => void;
    connect: () => void;
    disconnect: () => void;
    getMediaUrl: (resourceType: ResourceType, resourceId: string) => string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    invoke: <T = any>(channel: string, ...args: any[]) => Promise<T>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    send: (channel: string, ...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    listen: (channel: string, listener: (...args: any[]) => void) => () => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function useSocket() {
    const context = useContext(SocketContext);
    if (context === undefined) throw Error('useSocket must be used within a SocketProvider');
    return context;
}