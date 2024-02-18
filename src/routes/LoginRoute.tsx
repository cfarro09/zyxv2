import { Backdrop, CircularProgress } from '@mui/material';
import { getAccessToken } from 'common/helpers';
import { useSelector } from 'hooks';
import React, { ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { validateToken } from 'stores/login/actions';
interface LoginRouteProps {
    children: ReactNode;
}

const LoginRoute: React.FC<LoginRouteProps> = ({
    children,
}: LoginRouteProps) => {
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
        return children;
    } else if (resValidateToken.loading && !applications) {
        return (
            <Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={true}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    } else if (resValidateToken.error) {
        return children;
    } else {
        return <Navigate to={"/"} replace />;
    }
};

export default LoginRoute;
