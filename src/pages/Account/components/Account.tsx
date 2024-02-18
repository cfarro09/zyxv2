import { Box, Paper, Typography } from '@mui/material';
import { getCustomerSel } from 'common/helpers';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection } from 'stores/main/actions';
export const Account: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);

    const fetchData = useCallback(() => dispatch(getCollection(getCustomerSel(0))), [dispatch])


    useEffect(() => {
        fetchData();
    }, [dispatch, fetchData]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_CLIENT_SEL') {
            // setMainData((mainResult.data as ICustomer[]) || []);
        }
    }, [mainResult]);


    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Configuración de cuenta</Typography>
                </Box>
                <Box className="p-6">
                   
                </Box>
            </Paper>
        </Box>
    );
};

export default Account;