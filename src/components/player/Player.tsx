import styles from './Player.module.css';
import TrackInfo from "./TrackInfo";
import PlayerBtn from "./PlayerBtn";
import {useEffect, useState} from "react";
import {useWindow} from "../../context/WindowContext.ts";
import {usePlayer} from "../../context/PlayerContext.ts";
import ProgressBar from "../forms/ProgressBar";
import {formatTime} from "../../utils/time";
import {PiPauseCircleFill, PiPlayCircleFill, PiRepeatBold, PiRepeatOnceBold, PiSkipBackFill, PiSkipForwardFill, PiSpeakerSimpleSlashBold, PiStopFill} from "react-icons/pi";
import {getVolumeIcon} from "../../utils/utils";
import {clsx} from "clsx";
import {useProfiles} from "../../context/ProfilesContext.ts";
import type {RepeatMode} from "../../types";

const Player = () => {
    const {settings, updateVolumeAsync} = useWindow();
    const {boardType} = useProfiles();
    const {player, state, currentTrack, duration, currentTime, queue, index, repeat} = usePlayer();

    const [volume, setVolume] = useState<number>(settings[boardType].volume);
    const [muted, setMuted] = useState<boolean>(false);

    useEffect(() => {
        setVolume(settings[boardType].volume);
    }, [boardType, settings]);

    useEffect(() => {
        if (muted) player.setVolume(boardType, 0);
        else player.setVolume(boardType, volume);
    }, [boardType, volume, muted, player]);

    if (boardType !== 'music') return null;

    const changeRepeatMode = () => {
        let nextMode: RepeatMode = 'none';
        if (repeat === 'none') nextMode = 'all';
        else if (repeat === 'all') nextMode = 'one';
        player.setRepeatMode(nextMode);
    };

    const changeVolume = (_: number, newValue: number) => {
        if (muted && newValue > 0) setMuted(false);
        setVolume(newValue);
        updateVolumeAsync(boardType, newValue);
    };

    const toggleMute = () => {
        if (!muted) setMuted(true);
        else setMuted(false);
    };

    const queueExists = queue && queue.length > 0;
    const isFirstTrack = queueExists && index === 0;
    const isLastTrack = queueExists && index === queue.length - 1;
    const repeatModeAll = settings[boardType].repeat === 'all';
    const VolumeIcon = muted ? PiSpeakerSimpleSlashBold : getVolumeIcon(volume);

    return (
        <>
            <div className={styles.player}>
                <div className={styles.leftColumn}>
                    {state?.playing && currentTrack && <TrackInfo track={currentTrack} className={styles.trackInfo}/>}
                </div>

                <div className={styles.centerColumn}>
                    <div className={styles.playerButtons}>
                        <PlayerBtn
                            icon={<PiStopFill/>}
                            disabled={!state?.playing}
                            onClick={() => player.stop()}
                            title={'Stop'}
                        />
                        <PlayerBtn
                            icon={<PiSkipBackFill/>}
                            disabled={!queueExists || (isFirstTrack && !repeatModeAll)}
                            onClick={() => player.previous()}
                            title={'Previous'}
                        />
                        <PlayerBtn
                            icon={state?.playing && !state?.paused ? <PiPauseCircleFill/> : <PiPlayCircleFill/>}
                            size={'large'}
                            disabled={!currentTrack && !queueExists}
                            onClick={() => player.playPause()}
                            title={state?.playing && !state?.paused ? 'Pause' : 'Play'}
                        />
                        <PlayerBtn
                            icon={<PiSkipForwardFill/>}
                            disabled={!queueExists || (isLastTrack && !repeatModeAll)}
                            onClick={() => player.next()}
                            title={'Next'}
                        />
                        <PlayerBtn
                            icon={settings[boardType].repeat === 'one' ? <PiRepeatOnceBold/> : <PiRepeatBold/>}
                            onClick={changeRepeatMode}
                            className={settings[boardType].repeat === 'none' ? styles.disabledBtn : undefined}
                            title={`Repeat: ${settings[boardType].repeat}`}
                        />
                    </div>

                    <div className={styles.progressGroup}>
                        <span className={clsx(styles.progressTime, !state.playing && styles.hidden)}>{currentTime.formatted() || '00:00'}</span>
                        <ProgressBar
                            className={styles.progressBar}
                            seekable
                            disabled={!currentTrack}
                            max={state.playing ? duration?.getTimeMs() : 99999999}
                            val={state.playing ? currentTime.getTimeMs() : 0}
                            displayFunction={formatTime}
                            onChange={(_, newValue) => player.seek(newValue)}
                        />
                        <span className={clsx(styles.progressTime, !state.playing && styles.hidden)}>{duration.formatted() || '00:00'}</span>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <div className={styles.volumeBlock}>
                        <PlayerBtn
                            icon={<VolumeIcon/>}
                            onClick={toggleMute}
                            title={muted ? 'Unmute' : 'Mute'}
                        />
                        <ProgressBar className={styles.volumeSlider} min={0} max={100} val={volume} seekable onChange={changeVolume}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Player;