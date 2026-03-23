import styles from './HomePage.module.css';
import GridSoundboard from "../components/soundboard/grid/GridSoundboard.tsx";
import Player from "../components/player/Player.tsx";
import StatusBar from "../components/misc/StatusBar.tsx";
import {useWindow} from "../context/WindowContext.ts";
import SfxControls from "../components/soundboard/grid/sfx/SfxControls.tsx";

const HomePage = () => {
    const {boardType} = useWindow();

    return (
        <div className={styles.home}>
            <StatusBar/>
            <GridSoundboard gridHeight={`calc(100svh - var(--status-bar-height) - ${boardType === 'music' ? 'var(--player-height)' : 'var(--sfx-controls-height)'} - 10px)`}/>
            {boardType === 'music' && <Player/>}
            {boardType === 'sfx' && <SfxControls/>}
        </div>
    )
}

export default HomePage;