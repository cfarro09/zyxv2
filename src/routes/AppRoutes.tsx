// routes/AppRoutes.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute'; // Si deseas rutas privadas
import Login from '../pages/Login/Index';
import User from '../pages/User/Index';
// import User from '../pages/User/Index';

const AppRoutes: React.FC = () => {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <React.Suspense fallback={(
                <span>cargando</span>
            )}>
                <Routes>
                    <Route index path={"login"} element={<Login />} />
                    <Route path={"users"} element={
                        <PrivateRoute
                            isAuthenticated={true}
                            redirectTo="/login"
                        >
                            <User />
                        </PrivateRoute>
                    } />

                </Routes >
            </React.Suspense>
        </Router >
    );
};

export default AppRoutes;
