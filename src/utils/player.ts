import type {BoardType, RepeatMode} from "../types";

export class Player {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private readonly send: (channel: string, ...args: any[]) => void;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(sendMethod: (channel: string, ...args: any[]) => void) {
        this.send = sendMethod;
    }

    public play() {
        this.send('player:play');
    }

    public pause() {
        this.send('player:pause');
    }

    public playPause() {
        this.send('player:play_pause');
    }

    public next() {
        this.send('player:next');
    }

    public previous() {
        this.send('player:previous');
    }

    public stop() {
        this.send('player:stop');
    }

    public seek(time: number) {
        this.send('player:seek', time);
    }

    public playButton(boardType: BoardType, id: string) {
        this.send('player:play_button', boardType, id);
    }

    public stopSfx(id?: string) {
        this.send('player:stop_sfx', id);
    }

    public setVolume(boardType: BoardType, volume: number) {
        this.send('player:volume', boardType, volume);
    }

    public setRepeatMode(mode: RepeatMode) {
        this.send('player:repeat_mode', mode);
    }
}