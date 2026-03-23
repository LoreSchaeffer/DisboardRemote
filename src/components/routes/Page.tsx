import type {PropsWithChildren} from "react";
import type {Provider} from "../../App.tsx";
import {PlayerProvider} from "../../context/PlayerProvider.tsx";
import {ProfilesProvider} from "../../context/ProfilesProvider.tsx";
import {WindowProvider} from "../../context/WindowProvider.tsx";
import {useWindow} from "../../context/WindowContext.ts";
import Spinner from "../misc/Spinner.tsx";
import {useProfiles} from "../../context/ProfilesContext.ts";

export type PageProps = PropsWithChildren & {
    providers?: Provider[];
};

const WindowGuard = ({children}: PropsWithChildren) => {
    const {ready} = useWindow();
    if (!ready) return <Spinner size="lg"/>;
    return <>{children}</>;
};

const ProfilesGuard = ({children}: PropsWithChildren) => {
    const {ready} = useProfiles();
    if (!ready) return <Spinner size="lg"/>;
    return <>{children}</>;
};

const Page = ({providers = [], children}: PageProps) => {
    let content = <>{children}</>;

    if (providers.includes('player')) content = <PlayerProvider>{content}</PlayerProvider>;
    if (providers.includes('profiles')) {
        content = (
            <ProfilesProvider>
                <ProfilesGuard>
                    {content}
                </ProfilesGuard>
            </ProfilesProvider>
        );
    }
    if (providers.includes('window')) {
        content = (
            <WindowProvider>
                <WindowGuard>
                    {content}
                </WindowGuard>
            </WindowProvider>
        );
    }

    return content;
};

export default Page;