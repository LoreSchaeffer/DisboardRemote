import {type PropsWithChildren, useCallback, useEffect, useState} from "react";
import {remoteClient} from "../utils/remote-client.ts";
import type {ConnectionStatus, ResourceType} from "../types/remote.ts";
import {SocketContext} from "./SocketContext.ts";

const DEF_PORT = 4466;

export const SocketProvider = ({children}: PropsWithChildren) => {
    const [host, setHost] = useState<string | null>(() => localStorage.getItem('ws_host') || null);
    const [port, setPort] = useState<number>(() => {
        const savedPort = localStorage.getItem('ws_port');
        return savedPort ? parseInt(savedPort, 10) : DEF_PORT;
    });
    const [username, setUsername] = useState<string | null>(() => localStorage.getItem('ws_user') || null);
    const [password, setPassword] = useState<string | null>(() => {
        const savedPass = localStorage.getItem('ws_pass');
        if (savedPass) {
            try {
                return atob(savedPass);
            } catch {
                return null;
            }
        }
        return null;
    });

    const [status, setStatus] = useState<ConnectionStatus>(() => localStorage.getItem('ws_host') ? 'connecting' : 'disconnected');
    const [error, setError] = useState<string | null>(null);

    const connected = status === 'connected';
    const isConnecting = status === 'connecting';

    useEffect(() => {
        if (host) localStorage.setItem('ws_host', host);
        localStorage.setItem('ws_port', port.toString());
        if (username) localStorage.setItem('ws_user', username);
        if (password) localStorage.setItem('ws_pass', btoa(password));
    }, [host, port, username, password]);

    useEffect(() => {
        remoteClient.onStatusChange = (newStatus, err) => {
            setStatus(newStatus);
            setError(err || null);
        };

        return () => {
            remoteClient.onStatusChange = undefined;
            remoteClient.disconnect();
        };
    }, []);

    const setConnectionParams = (newHost: string | null, newPort: number | null) => {
        setHost(newHost);
        setPort(newPort || DEF_PORT);
    };

    const setCredentials = (newUsername: string | null, newPassword: string | null) => {
        setUsername(newUsername);
        setPassword(newPassword);
    };

    const connect = useCallback(() => {
        if (!host) {
            console.warn("[SocketClient] Host is required to connect.");
            return;
        }

        remoteClient.connect(`ws://${host}:${port}`, username || undefined, password || undefined);
    }, [host, port, username, password]);

    useEffect(() => {
        if (host) {
            console.log('[SocketClient] Attempting auto-connect...');

            const timeoutId = setTimeout(() => connect(), 0);
            return () => clearTimeout(timeoutId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [host]);

    const disconnect = useCallback(() => {
        remoteClient.disconnect();
    }, []);

    const getMediaUrl = useCallback((resourceType: ResourceType, id: string) => {
        const token = remoteClient.getAuthToken();
        const tokenQuery = token ? `?token=${token}` : '';
        return `http://${host}:${port}/api/${resourceType}/${id}${tokenQuery}`;
    }, [host, port]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoke = useCallback((channel: string, ...args: any[]) => remoteClient.invoke(channel, ...args), []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const send = useCallback((channel: string, ...args: any[]) => remoteClient.send(channel, ...args), []);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listen = useCallback((channel: string, listener: (...args: any[]) => void) => remoteClient.listen(channel, listener), []);

    return (
        <SocketContext.Provider value={{
            host,
            port,
            username,
            password,
            connected,
            error,
            setConnectionParams,
            setCredentials,
            connect,
            isConnecting,
            disconnect,
            getMediaUrl,
            invoke,
            send,
            listen,
        }}>
            {children}
        </SocketContext.Provider>
    );
}