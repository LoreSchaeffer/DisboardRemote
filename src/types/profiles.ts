import type {BoardType} from "./common.ts";
import type {SbAmbientBtn, SbGridBtn} from "./buttons.ts";

export type SbGridProfile = {
    id: string;
    name: string;
    type: Exclude<BoardType, 'ambient'>;
    rows: number;
    cols: number;
    buttons: SbGridBtn[];
}

export type SbAmbientProfile = {
    id: string;
    name: string;
    type: 'ambient';
    buttons: SbAmbientBtn[];
}