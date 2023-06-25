import { BrowserRouter, Route, RouterProvider, Routes, createBrowserRouter, redirect, useNavigate } from 'react-router-dom';
import { CatBreed } from './components/catBreed';
import { useEffect } from 'react';
import { ContextsWrapper } from './contexts';
import { BrowseCatBreeds } from './components/browseCatBreeds';

/**
 * Basic routing for 2 pages:
 * - Browse
 * - View Breed
 * @returns {JSX.Element}
 */
export function Router() {
    return (
        <ContextsWrapper>
            <BrowserRouter>
                <Routes path="/">
                    <Route path="/breed/:breedId" element={<CatBreed />} />
                    <Route index element={<BrowseCatBreeds />} />
                    <Route path="*" element={<Redirect to="/" />} />
                </Routes>
            </BrowserRouter>
        </ContextsWrapper>
    )
}

function Redirect({ to }) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to, { replace: true });
    }, []);
    return <>Redirect {to}</>;
}