import styles from "./StatusBar.module.css";
import Select from "../forms/Select.tsx";
import {useProfiles} from "../../context/ProfilesContext.ts";
import {useWindow} from "../../context/WindowContext.ts";
import type {BoardType, SbGridProfile} from "../../types";
import {clsx} from "clsx";

const boardOptions = [
    {value: 'music', label: 'Music Board'},
    {value: 'sfx', label: 'SFX Board'}
]

const StatusBar = () => {
    const {boardType, setBoardType} = useWindow();
    const {gridProfiles, activeGridProfile, setActiveProfile} = useProfiles();

    const handleProfileClick = (profile: SbGridProfile) => {
        if (activeGridProfile?.id === profile.id) return;
        setActiveProfile(profile.id);
    }

    return (
        <div className={styles.statusBar}>
            <Select
                className={styles.boardSelect}
                options={boardOptions}
                value={boardType}
                onChange={(val) => setBoardType(val as BoardType)}
            />
            <div className={styles.profiles}>
                {gridProfiles.map(p => {
                    return (
                        <div
                            className={clsx(styles.profileBtn, activeGridProfile?.id === p.id && styles.active)}
                            key={p.id}
                            onClick={() => handleProfileClick(p)}
                        >
                            {p.name}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default StatusBar;