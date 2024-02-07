// routes/PrivateRoute.tsx

import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
    children: ReactNode;
    isAuthenticated: boolean;
    redirectTo: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    children,
    isAuthenticated,
    redirectTo,
}: PrivateRouteProps) => {
    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

export default PrivateRoute;
