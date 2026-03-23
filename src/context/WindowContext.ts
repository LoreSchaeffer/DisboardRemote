import type {BoardType, Settings} from "../types";
import {createContext, useContext} from "react";

export type WindowContextType = {
    boardType: BoardType;
    setBoardType: (boardType: BoardType) => void;
    settings: Settings;
    ready: boolean;
    updateVolumeAsync: (boardType: BoardType, volume: number) => void;
}

export const WindowContext = createContext<WindowContextType | undefined>(undefined);

export function useWindow() {
    const context = useContext(WindowContext);
    if (context === undefined) throw Error('useWindow must be used within a WindowProvider');
    return context;
}