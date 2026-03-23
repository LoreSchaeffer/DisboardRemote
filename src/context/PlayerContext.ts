import type {PlayerState, PlayerTrack, RepeatMode, SfxState} from "../types";
import {createContext, useContext} from "react";
import {Time} from "../utils/time.ts";
import {Player} from "../utils/player.ts";

export type PlayerContextType = {
    player: Player;
    state: PlayerState;
    repeat: RepeatMode;
    queue: PlayerTrack[];
    index: number;
    currentTrack: PlayerTrack | null;
    duration: Time;
    currentTime: Time;
    activeSfx: Record<string, SfxState>;
}

export const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function usePlayer() {
    const context = useContext(PlayerContext);
    if (context === undefined) throw new Error('usePlayer must be used within a PlayerProvider');
    return context;
}