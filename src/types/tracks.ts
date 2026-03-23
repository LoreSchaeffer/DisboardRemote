export type Track = {
    id: string;
    title: string;
    duration: number;
    downloading: boolean;
}

export type PlayerTrack = Track & {
    titleOverride: string;
}