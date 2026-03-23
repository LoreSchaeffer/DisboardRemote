import {useWindow} from "./WindowContext.ts";
import {useSocket} from "./SocketContext.ts";
import {type PropsWithChildren, useCallback, useEffect, useMemo, useState} from "react";
import type {SbAmbientProfile, SbGridProfile} from "../types";
import {ProfilesContext} from "./ProfilesContext.ts";

export const ProfilesProvider = ({children}: PropsWithChildren) => {
    const {boardType, settings} = useWindow();
    const {invoke, listen, connected, send} = useSocket();

    const [gridProfiles, setGridProfiles] = useState<SbGridProfile[] | null>(null);
    const [ambientProfiles, setAmbientProfiles] = useState<SbAmbientProfile[] | null>(null);

    useEffect(() => {
        if (!boardType || !connected) return;

        let unsub: (() => void) | undefined;

        if (boardType === 'music' || boardType === 'sfx') {
            invoke('grid_profiles:get_all', boardType).then((profiles) => setGridProfiles(profiles));
            unsub = listen(`grid_profiles:${boardType}:changed`, (profiles) => setGridProfiles(profiles));
        } else {
            invoke('ambient_profiles:get_all').then((profiles) => setAmbientProfiles(profiles));
            unsub = listen('ambient_profiles:changed', (profiles) => setAmbientProfiles(profiles));
        }

        return () => {
            unsub?.();
        }
    }, [boardType, invoke, listen, connected]);

    const activeGridProfile: SbGridProfile | null = useMemo(() => {
        if (!settings || gridProfiles === null || !boardType) return null;

        const boardSettings = settings[boardType];
        if (!boardSettings) return null;

        return gridProfiles.find(p => p.id === boardSettings.activeProfile) || null;
    }, [settings, gridProfiles, boardType]);

    const activeAmbientProfile: SbAmbientProfile | null = useMemo(() => {
        if (!settings || ambientProfiles === null || !boardType) return null;

        const boardSettings = settings[boardType];
        if (!boardSettings) return null;

        return ambientProfiles.find(p => p.id === boardSettings.activeProfile) || null;
    }, [settings, ambientProfiles, boardType]);

    const ready = useMemo(() => {
        if (!boardType || !settings) return false;

        if (boardType === 'music' || boardType === 'sfx') return gridProfiles !== null;
        else return ambientProfiles !== null;
    }, [boardType, settings, gridProfiles, ambientProfiles]);

    const setActiveProfile = useCallback((profileId: string) => {
        if (!connected || !boardType) return;

        send('settings:set_active_profile', boardType, profileId);
    }, [connected, boardType, send]);

    if (!boardType) return null;

    return (
        <ProfilesContext.Provider value={{
            ready,
            boardType,
            gridProfiles: gridProfiles || [],
            activeGridProfile: activeGridProfile,
            ambientProfiles: ambientProfiles || [],
            activeAmbientProfile: activeAmbientProfile,
            setActiveProfile
        }}>
            {children}
        </ProfilesContext.Provider>
    )
}