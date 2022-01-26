import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import MainLayout from './layouts/MainLayout';
import EmptyLayout from './layouts/EmptyLayout';
//
import Market from './pages/Market';
import Tokens from './pages/Token';
import TokenTester from './pages/tester/TokenTester';
import TestReact from './pages/TestReact';
import NotFound from './pages/Page404';

// ----------------------------------------------------------------------
export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: '/', element: <Market /> },
        { path: 'market', element: <Market /> },
        { path: 'tokens', element: <Tokens /> },
        { path: 'tester', element: <TokenTester /> },
        { path: 'test_react', element: <TestReact /> },
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
