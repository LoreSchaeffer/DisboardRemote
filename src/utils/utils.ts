import type {ElementType} from "react";
import {PiSpeakerHighBold, PiSpeakerLowBold, PiSpeakerNoneBold} from "react-icons/pi";

export const clamp = (num: number, min: number, max: number): number => {
    return Math.min(Math.max(num, min), max);
}

export const getVolumeIcon = (volume: number): ElementType => {
    if (volume < 15) return PiSpeakerNoneBold;
    if (volume < 50) return PiSpeakerLowBold;
    return PiSpeakerHighBold;
}