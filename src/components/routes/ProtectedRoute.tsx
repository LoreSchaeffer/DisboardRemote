import {useEffect} from "react";
import {Navigate, useLocation, useNavigate} from "react-router-dom";
import {useSocket} from "../../context/SocketContext.ts";
import Page, {type PageProps} from "./Page.tsx";
import Spinner from "../misc/Spinner.tsx";

const ProtectedRoute = ({providers, children}: PageProps) => {
    const {connected, isConnecting} = useSocket();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!connected && !isConnecting && location.pathname !== '/connect') navigate('/connect', {replace: true});
    }, [connected, isConnecting, navigate, location.pathname]);

    if (isConnecting) return <Spinner size={'lg'}/>;
    if (!connected) return <Navigate to="/connect" replace/>;
    return <Page providers={providers}>{children}</Page>;
};

export default ProtectedRoute;