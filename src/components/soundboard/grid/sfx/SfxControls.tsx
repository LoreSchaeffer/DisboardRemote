import styles from "./SfxControls.module.css";
import {useEffect, useState} from "react";
import {PiSlidersHorizontalBold, PiSpeakerSimpleSlashBold, PiStopCircleFill} from "react-icons/pi";
import {useWindow} from "../../../../context/WindowContext.ts";
import {useProfiles} from "../../../../context/ProfilesContext.ts";
import {usePlayer} from "../../../../context/PlayerContext.ts";
import {getVolumeIcon} from "../../../../utils/utils.ts";
import PlayerBtn from "../../../player/PlayerBtn.tsx";
import ProgressBar from "../../../forms/ProgressBar.tsx";

type SfxControlsProps = {
    showProfileSettings?: () => void;
}

const SfxControls = ({showProfileSettings}: SfxControlsProps) => {
    const {settings, updateVolumeAsync} = useWindow();
    const {boardType} = useProfiles();
    const {player, activeSfx} = usePlayer();

    const [volume, setVolume] = useState<number>(settings[boardType].volume);
    const [muted, setMuted] = useState<boolean>(false);

    useEffect(() => {
        setVolume(settings[boardType].volume);
    }, [boardType, settings]);

    useEffect(() => {
        if (muted) player.setVolume(boardType, 0);
        else player.setVolume(boardType, volume);
    }, [boardType, volume, muted, player]);

    if (boardType !== 'sfx') return null;

    const changeVolume = (_: number, newValue: number) => {
        if (muted && newValue > 0) setMuted(false);
        setVolume(newValue);
        updateVolumeAsync(boardType, newValue);
    };

    const toggleMute = () => {
        if (!muted) setMuted(true);
        else setMuted(false);
    };

    const VolumeIcon = muted ? PiSpeakerSimpleSlashBold : getVolumeIcon(volume);
    const activeSfxCount = Object.values(activeSfx).length;

    return (
        <div className={styles.controls}>
            <div className={styles.leftColumn}>
                {activeSfxCount > 0 && (
                    <span>Playing {activeSfxCount} SFX</span>
                )}
            </div>
            <div className={styles.centerColumn}>
                <PlayerBtn
                    icon={<PiStopCircleFill/>}
                    size={'large'}
                    disabled={activeSfxCount === 0}
                    onClick={() => player.stopSfx()}
                    title={'Stop All'}
                />
            </div>
            <div className={styles.rightColumn}>
                <PlayerBtn
                    icon={<PiSlidersHorizontalBold/>}
                    title={'Profile settings'}
                    onClick={showProfileSettings}
                />
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
    )
}

export default SfxControls;