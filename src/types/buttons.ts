import type {Track} from "./tracks.ts";

export type BtnStyle = {
    textColor?: string;
    textColorHover?: string;
    textColorActive?: string;
    backgroundColor?: string;
    backgroundColorHover?: string;
    backgroundColorActive?: string;
    borderColor?: string;
    borderColorHover?: string;
    borderColorActive?: string;
}

export type SbGridBtn = {
    id: string;
    row: number;
    col: number;
    track?: Track;
    title?: string;
    style?: BtnStyle;
}

export type SbAmbientBtn = {
    id: string;
    title: string;
}