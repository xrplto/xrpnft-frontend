import { Navigate, useRoutes } from 'react-router-dom';
import MainLayout from 'components/layouts/MainLayout';
import EmptyLayout from 'components/layouts/EmptyLayout';
import TokenTesterUpdated from 'pages/tester/TokenTesterUpdated';
import Spinner from 'pages/spinner/Spinner';
import ProgressPage from 'pages/progress/ProgressPage';
import NotFound from 'pages/Page404';
import Minting from 'pages/mintpage'
import NFTInfo from 'pages/offpage'
import Account from 'pages/account/Account'
import NFTMarketplace from 'pages/market/Landing';

// ----------------------------------------------------------------------
export default function Router() {
    return useRoutes([
        {
            path: '/',
            element: <MainLayout />,
            children: [
                // { path: '/', element: <NFTList /> },
                { path: '/', element: <NFTMarketplace /> },
                { path: 'tester', element: <TokenTesterUpdated /> },
                { path: 'spinners', element: <Spinner /> },
                { path: 'progress', element: <ProgressPage /> },
                { path: 'offpage/:tokenID', element: <NFTInfo /> },
                { path: 'create', element: <Minting /> },
                { path: 'account', element: <Account /> },
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
