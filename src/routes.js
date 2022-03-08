import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import MainLayout from './layouts/MainLayout';
import EmptyLayout from './layouts/EmptyLayout';
//
import Market from './pages/market/Market';
import TokenTester from './pages/tester/TokenTester';
import Spinner from './pages/spinner/Spinner';
import ProgressPage from './pages/progress/ProgressPage';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------
export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                { path: '/', element: <Market /> },
                { path: 'tester', element: <TokenTester /> },
                { path: 'spinners', element: <Spinner /> },
                { path: 'progress', element: <ProgressPage /> },
                { path: '*', element: <Navigate to="/404/NotFound" /> }
            ]
        },
        {
            path: '/404',
            element: <EmptyLayout />,
            children: [
                { path: '*', element: <NotFound /> }
            ]
        }
    ]);
}
