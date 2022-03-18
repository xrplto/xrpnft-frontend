import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import MainLayout from './layouts/MainLayout';
import EmptyLayout from './layouts/EmptyLayout';
//
import Market from './pages/market/Market';
import TokenTesterUpdated from './pages/tester/TokenTesterUpdated';
import Spinner from './pages/spinner/Spinner';
import ProgressPage from './pages/progress/ProgressPage';
import NotFound from './pages/Page404';
import { NFTList } from './components/NFTList';
import NFTInfo from './pages/offpage'
import PersistentDrawerLeft from './pages/market/Drawer';

// ----------------------------------------------------------------------
export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                // { path: '/', element: <NFTList /> },
                { path: '/', element: <PersistentDrawerLeft /> },
                { path: 'tester', element: <TokenTesterUpdated /> },
                { path: 'spinners', element: <Spinner /> },
                { path: 'progress', element: <ProgressPage /> },
                { path: 'offpage', element: <NFTInfo /> },
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
