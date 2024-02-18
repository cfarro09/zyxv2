import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Si deseas rutas privadas
import Login from '../pages/Login/Index';
import MainLayout from 'components/Layout/MainLayout';
import { routes } from './routes';
import LoginRoute from './LoginRoute';
import NotFoundPage from 'pages/NotFound';
import ForbiddenPage from 'pages/Forbidden';

const AppRoutes: React.FC = () => {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <React.Suspense fallback={(
                <span>cargando</span>
            )}>
                <Routes>
                    <Route index path={"login"} element={
                        <LoginRoute>
                            <Login />
                        </LoginRoute>
                    } />
                    {routes.map(route => (
                        <React.Fragment key={route.path}>
                            <Route path={route.path} element={
                                <PrivateRoute redirectTo="/login">
                                    <MainLayout>
                                        {route.mainView}
                                    </MainLayout>
                                </PrivateRoute>
                            } />
                            {route.manageView && (
                                <Route path={`${route.path}/:id`} element={
                                    <PrivateRoute redirectTo="/login">
                                        <MainLayout>
                                            {route.manageView(route.path)}
                                        </MainLayout>
                                    </PrivateRoute>
                                } />
                            )}
                        </ React.Fragment>
                    ))}
                    <Route path="*" element={
                        <NotFoundPage />
                    } />
                    <Route path="403" element={
                        <ForbiddenPage />
                    } />
                </Routes >
            </React.Suspense>
        </Router >
    );
};

export default AppRoutes;