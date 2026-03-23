import {createContext, useContext} from "react";
import type {BoardType, SbAmbientProfile, SbGridProfile} from "../types";

export type ProfilesContextType = {
    ready: boolean;
    boardType: BoardType;
    gridProfiles: SbGridProfile[];
    activeGridProfile: SbGridProfile | null;
    ambientProfiles: SbAmbientProfile[];
    activeAmbientProfile: SbAmbientProfile | null;
    setActiveProfile: (profileId: string) => void;
}

export const ProfilesContext = createContext<ProfilesContextType | undefined>(undefined);

export function useProfiles() {
    const context = useContext(ProfilesContext);
    if (context === undefined) throw new Error('useProfiles must be used within a ProfilesContext');
    return context;
}