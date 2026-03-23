import type {Track} from "./tracks.ts";
import type {RepeatMode} from "./common.ts";

export type PlayerState = {
    playing: boolean;
    paused: boolean;
    seeking: boolean;
    loading: boolean;
}

export type SfxState = {
    playing: boolean;
    progress: number;
    volume: number;
}

export type PlayerFullState = {
    state: PlayerState;
    currentTrack: Track | null;
    queue: Track[];
    index: number;
    repeatMode: RepeatMode;
    masterVolume: number;
    activeSfx: SfxState[];
    duration: number;
    currentTime: number;
}

export type Timeupdate = {
    currentTime: number,
    duration: number
}