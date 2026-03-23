import type {BoardType, PlayerFullState, PlayerState, PlayerTrack, RepeatMode, SfxState, Timeupdate} from "../types";
import {type PropsWithChildren, useEffect, useMemo, useState} from "react";
import {useSocket} from "./SocketContext.ts";
import {useWindow} from "./WindowContext.ts";
import {Time} from "../utils/time.ts";
import {Player} from "../utils/player.ts";
import { PlayerContext } from "./PlayerContext.ts";

export const PlayerProvider = ({children}: PropsWithChildren) => {
    const {listen, send, connected} = useSocket();
    const {boardType} = useWindow();

    const player = useMemo(() => new Player(send), [send]);

    const [state, setState] = useState<PlayerState>({playing: false, paused: false, loading: false, seeking: false});
    const [repeat, setRepeat] = useState<RepeatMode>('none');
    const [queue, setQueue] = useState<PlayerTrack[]>([]);
    const [index, setIndex] = useState<number>(0);
    const [currentTrack, setCurrentTrack] = useState<PlayerTrack | null>(null);
    const [duration, setDuration] = useState<Time>(new Time(0, 'ms'));
    const [currentTime, setCurrentTime] = useState<Time>(new Time(0, 'ms'));
    const [activeSfx, setActiveSfx] = useState<Record<string, SfxState>>({});

    useEffect(() => {
        if (!boardType || !connected) return;

        const unsubState = listen('player:state', (bt: BoardType, newState: PlayerFullState) => {
            if (boardType !== bt) return;

            setState(prev => {
                if (
                    prev.playing === newState.state.playing &&
                    prev.paused === newState.state.paused &&
                    prev.loading === newState.state.loading &&
                    prev.seeking === newState.state.seeking
                ) {
                    return prev;
                }

                if (newState.state) return newState.state;
                else return prev;
            });
            setRepeat(newState.repeatMode);
            setIndex(newState.index);
            setCurrentTrack(prev => {
                if (!prev && !newState.currentTrack) return prev;
                if (prev && newState.currentTrack && prev.id === newState.currentTrack.id) return prev;

                return newState.currentTrack as PlayerTrack;
            });
            setQueue(prev => {
                if (prev.length !== newState.queue.length) return newState.queue as PlayerTrack[];
                if (prev.map(t => t.id).join() === newState.queue.map(t => t.id).join()) return prev;

                return newState.queue as PlayerTrack[];
            });
            setDuration(prev => {
                if (prev.getTimeMs() && prev.getTimeMs() === newState.duration) return prev;
                if (newState.duration) return new Time(newState.duration, 'ms');
                return prev;
            });
            setCurrentTime(prev => {
                if (prev.getTimeMs() && prev.getTimeMs() === newState.currentTime) return prev;
                if (newState.currentTime) return new Time(newState.currentTime, 'ms');
                return prev;
            });
            setActiveSfx(prev => {
                const newRecord: Record<string, SfxState> = {};

                if (Array.isArray(newState.activeSfx)) newState.activeSfx.forEach((sfx, index) => newRecord[index.toString()] = sfx);
                else Object.assign(newRecord, newState.activeSfx);

                if (JSON.stringify(prev) === JSON.stringify(newRecord)) return prev;

                return newRecord;
            });
        });

        const unsubTimeupdate = listen('player:timeupdate', (bt: BoardType, timeupdate: Timeupdate) => {
            if (boardType !== bt) return;

            if (timeupdate.duration) {
                setDuration(prev => {
                    if (prev.getTimeMs() && prev.getTimeMs() === timeupdate.duration) return prev;
                    return new Time(timeupdate.duration, 'ms');
                });
            }

            if (timeupdate.currentTime) {
                setCurrentTime(prev => {
                    if (prev.getTimeMs() && prev.getTimeMs() === timeupdate.currentTime) return prev;
                    return new Time(timeupdate.currentTime, 'ms');
                });
            }
        });

        send('player:state', boardType);

        return () => {
            unsubState();
            unsubTimeupdate();
        }
    }, [boardType, listen, send, connected]);

    return (
        <PlayerContext.Provider value={{
            player,
            state,
            repeat,
            queue,
            index,
            currentTrack,
            duration,
            currentTime,
            activeSfx
        }}>
            {children}
        </PlayerContext.Provider>
    )
}