import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { MainFunctional } from './components/mainFunctional'

const router = createBrowserRouter([
    { 
        path: '/',
        element: <MainFunctional />
    }
]);

export function Router () {
    return <RouterProvider router={router} />
}