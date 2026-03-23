import type {BoardType, Settings} from "../types";
import {type PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {useLocation, useSearchParams} from "react-router-dom";
import {useSocket} from "./SocketContext.ts";
import {WindowContext} from "./WindowContext.ts";

const VALID_BOARDS: BoardType[] = ['music', 'sfx', 'ambient'];
const DEFAULT_BOARD: BoardType = 'music';

export const WindowProvider = ({children}: PropsWithChildren) => {
    const {invoke, listen, connected, send} = useSocket();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [settings, setSettings] = useState<Settings | undefined>(undefined);

    const saveVolumeTimeoutRef = useRef<number | null>(null);

    const rawBoard = searchParams.get('board');
    const isValidBoard = rawBoard !== null && VALID_BOARDS.includes(rawBoard as BoardType);
    const boardType: BoardType = isValidBoard ? (rawBoard as BoardType) : DEFAULT_BOARD;

    useEffect(() => {
        if (!connected) return;

        invoke('settings:get').then(setSettings);
        const unsub = listen('settings:changed', setSettings);

        return () => {
            unsub?.();
        }
    }, [invoke, listen, connected]);

    const setBoardType = useCallback((newBoard: BoardType) => {
        if (location.pathname === '/connect') return;

        setSearchParams(
            (prevParams) => {
                const params = new URLSearchParams(prevParams);

                if (newBoard) params.set('board', newBoard as string);
                else params.delete('board');

                return params;
            },
            {replace: true}
        );
    }, [setSearchParams, location]);

    useEffect(() => {
        if (!isValidBoard) setBoardType(DEFAULT_BOARD);
    }, [isValidBoard, setBoardType]);

    const updateVolumeAsync = (boardType: BoardType, volume: number) => {
        setSettings(prev => {
            if (prev) return {...prev, [boardType]: {...prev[boardType], volume: volume}};
            else return prev;
        });

        if (saveVolumeTimeoutRef.current) clearTimeout(saveVolumeTimeoutRef.current);
        saveVolumeTimeoutRef.current = setTimeout(() => {
            send('settings:set_volume', boardType, volume);
            saveVolumeTimeoutRef.current = null;
        }, 250);
    }

    const ready = settings !== undefined;

    return (
        <WindowContext.Provider value={{
            boardType,
            setBoardType,
            settings: settings!,
            ready,
            updateVolumeAsync
        }}>
            {children}
        </WindowContext.Provider>
    );
}