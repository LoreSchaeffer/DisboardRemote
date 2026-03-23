import styles from './TrackInfo.module.css';
import {clsx} from "clsx";
import type {PlayerTrack} from "../../types";
import {useSocket} from "../../context/SocketContext.ts";

type TrackInfoProps = {
    track: PlayerTrack
    className?: string
}

const TrackInfo = ({track, className}: TrackInfoProps) => {
    const {getMediaUrl} = useSocket();

    return (
        <div className={clsx(styles.trackInfo, className)}>
            <img
                className={styles.image}
                src={track ? getMediaUrl('thumbnail', track.id) : './images/track.png'}
                alt={track.titleOverride || track.title || 'Unknown Title'}
                onError={(e) => {
                    const img = e.currentTarget;
                    img.onerror = null;
                    img.src = './images/track.png';
                }}
            />
            <div className={styles.data}>
                <span className={styles.title}>{track.titleOverride || track.title || 'Unknown Title'}</span>
            </div>
        </div>
    );
}

export default TrackInfo;