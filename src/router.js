import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter, redirect, useNavigate } from 'react-router-dom';
import { MainFunctional } from './components/mainFunctional'
import { CatBreed } from './components/catBreed';
import { useEffect } from 'react';

const router = createBrowserRouter([
    {
        path: '/',
        element: <MainFunctional />
    }
]);

export function Router() {
    return <BrowserRouter>
        <Routes path="/">
            <Route path="/breed/:breedId" element={<CatBreed />} />
            <Route index element={<MainFunctional />} />
            <Route path="*" element={<Redirect to="/" />} />
        </Routes>
    </BrowserRouter>
}

function Redirect({ to }) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to, { replace: true });
    }, []);
    return <>Redirect {to}</>;
}