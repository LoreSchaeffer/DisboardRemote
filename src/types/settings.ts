import type {BoardType, RepeatMode} from "./common.ts";

export type BoardSettings = {
    width: number;
    height: number;
    volume: number;
    activeProfile: string;
    zoom: number;
    repeat?: RepeatMode;
}

export type Settings = {
    openOnStartup: BoardType[];

    music: BoardSettings;
    sfx: BoardSettings;
    ambient: BoardSettings;

    showImages: boolean;
}