import styles from "./GridSoundboard.module.css";
import {type MouseEvent, useMemo} from "react";
import {useWindow} from "../../../context/WindowContext.ts";
import {useProfiles} from "../../../context/ProfilesContext.ts";
import GridButton from "./GridButton.tsx";
import type {SbGridBtn} from "../../../types";
import {useSocket} from "../../../context/SocketContext.ts";
import {usePlayer} from "../../../context/PlayerContext.ts";

type GridSoundboardProps = {
    gridHeight?: string;
}

const GridSoundboard = ({gridHeight = 'calc(100vh - var(--titlebar-height) - 1px)',}: GridSoundboardProps) => {
    const {settings} = useWindow();
    const {send} = useSocket();
    const {boardType, activeGridProfile} = useProfiles();
    const {activeSfx} = usePlayer();

    const rows = activeGridProfile?.rows || 8;
    const cols = activeGridProfile?.cols || 10;

    const buttonMap = useMemo(() => {
        const map = new Map<string, SbGridBtn>();
        if (!activeGridProfile?.buttons) return map;

        for (const btn of activeGridProfile.buttons) {
            map.set(`${btn.row}-${btn.col}`, btn);
        }
        return map;
    }, [activeGridProfile]);

    if (!activeGridProfile) return null;

    const onClick = (_: MouseEvent, button: SbGridBtn) => {
        if (!button || !button.track) return
        send('player:play_button', boardType, button.id);
    }

    return (
        <div
            className={styles.soundboard}
            style={{
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                height: gridHeight
            }}
        >
            {Array.from({length: rows}).map((_, row) =>
                Array.from({length: cols}).map((_, col) => {
                    const button = buttonMap.get(`${row}-${col}`);
                    const hasTrack = button && !!button.track;
                    const isDownloading = hasTrack && button.track!.downloading;

                    const currentSfxState = button ? activeSfx[button.id] : undefined;
                    const isActive = currentSfxState?.playing || false;
                    const progress = currentSfxState?.progress || 0;

                    return (
                        <GridButton
                            key={`btn-${row}-${col}`}
                            row={row}
                            col={col}
                            button={button || undefined}
                            onClick={hasTrack && !isDownloading ? onClick : undefined}
                            zoom={settings?.[boardType].zoom ?? 1}
                            showImages={settings?.showImages ?? true}
                            active={isActive}
                            progress={progress}
                        />
                    );
                })
            )}
        </div>
    );
}

export default GridSoundboard;