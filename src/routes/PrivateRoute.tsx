import { Backdrop, CircularProgress } from '@mui/material';
import { getAccessToken, normalizePathname } from 'common/helpers';
import { useSelector } from 'hooks';
import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { validateToken } from 'stores/login/actions';
interface PrivateRouteProps {
    children: ReactNode;
    redirectTo: string;
}
const cleanPath = (pathx: string) => {
    if (pathx.split("/").length === 3) {
        return `/${pathx.split("/")[1]}`
    }
    return normalizePathname(pathx);
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
    children,
    redirectTo,
}: PrivateRouteProps) => {
    const location = useLocation();
    const resValidateToken = useSelector(state => state.login.validateToken);
    const applications = resValidateToken?.user?.menu;

    const dispatch = useDispatch();
    const existToken = getAccessToken();

    React.useEffect(() => {
        if (existToken) {
            dispatch(validateToken(localStorage.getItem("firstLoad") ?? ""));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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
    } else if (location.pathname !== "/" && !applications?.[cleanPath(location.pathname)]?.[0]) {
        return <Navigate to={"/403"} replace />;
    } else {
        return children;
    }
};

export default PrivateRoute;
