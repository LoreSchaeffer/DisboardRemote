import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import './App.css';
import ProtectedRoute from "./components/routes/ProtectedRoute";
import Page from "./components/routes/Page.tsx";
import type {ReactNode} from "react";
import ConnectPage from "./pages/ConnectPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import {SocketProvider} from "./context/SocketProvider.tsx";

export type Provider = 'window' | 'player' | 'profiles';

type AppRoute = {
    path: string;
    requireLogin: boolean;
    element: ReactNode;
    providers?: Provider[];
}

const locations: AppRoute[] = [
    {path: '/', requireLogin: true, element: <HomePage/>, providers: ['window', 'player', 'profiles']},
    {path: '/connect', requireLogin: false, element: <ConnectPage/>},
    {path: '*', requireLogin: false, element: <div>Not found</div>},
];

const router = createBrowserRouter(locations.map(route => ({
    path: route.path,
    element: route.requireLogin
        ? <ProtectedRoute providers={route.providers}>{route.element}</ProtectedRoute>
        : <Page providers={route.providers}>{route.element}</Page>
})));

function App() {
    return (
        <div className={'app'}>
            <SocketProvider>
                <RouterProvider router={router}/>
            </SocketProvider>
        </div>
    );
}

export default App;