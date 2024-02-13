// routes/PrivateRoute.tsx

import { Backdrop, CircularProgress } from '@mui/material';
import { getAccessToken } from 'common/helpers';
import { useSelector } from 'hooks';
import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { validateToken } from 'stores/login/actions';

interface PrivateRouteProps {
    children: ReactNode;
    redirectTo: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    children,
    redirectTo,
}: PrivateRouteProps) => {

    const resValidateToken = useSelector(state => state.login.validateToken);
    const applications = resValidateToken?.user?.menu;

    const dispatch = useDispatch();
    const existToken = getAccessToken();

    React.useEffect(() => {
        if (existToken)
            dispatch(validateToken(localStorage.getItem("firstLoad") ?? ""));
    }, [dispatch, existToken])

    if (!existToken) {
        return <Navigate to={redirectTo} replace />;
    } else if (resValidateToken.loading && !applications) {
        return (
            <Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    } else if (resValidateToken.error) {
        return <Navigate to={redirectTo} replace />;
    // } else if (location.pathname !== "/" && !applications?.[cleanPath(location.pathname)]?.[0]) {
    //     return <Redirect to={{ pathname: "/403" }} />;
    // } else if (location.pathname === "/") {
    //     return <Redirect to={{ pathname: resValidateToken.user?.redirect }} />
    } else {
        return children;
    }

    
};

export default PrivateRoute;
