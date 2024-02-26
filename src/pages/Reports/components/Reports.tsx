import { Box, Button, Paper, Typography } from '@mui/material';
import { getSalePayment } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { ISale } from '@types';
import dayjs from 'dayjs';
import Filters from './FiltersReport';
import { PointOfSale } from '@mui/icons-material';
import ProfitResumeDialog from './ProfitResumeDialog';


const columns: ColumnDef<ISale>[] = [
    {
        header: 'FECHA',
        accessorKey: 'createdate',
    },
    {
        header: 'METODO DE PAGO',
        accessorKey: 'payment_method',
    },
    {
        header: 'TRANSACCIONES',
        accessorKey: 'count',
    },
    {
        header: 'TOTAL',
        accessorKey: 'total',
    },
];

export const Reports: React.FC = () => {
    const dispatch = useDispatch();
    const [openProfitResumeDialog, setOpenProfitResumeDialog] = useState(false)
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<ISale[]>([]);
    const [filters, setFilters] = useState<{ startdate: Date; enddate: Date; }>({
        startdate: dayjs().toDate(),
        enddate: dayjs().toDate(),
    })
    const fetchData = useCallback(() => dispatch(getCollection(getSalePayment(filters))), [dispatch, filters])


    useEffect(() => {
        return () => {
            dispatch(resetMain());
        }
    }, []);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_SALE_PAYMENTS_RESUME_REPORT') {
            setMainData((mainResult.data as ISale[]) || []);
        }
    }, [mainResult]);

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <Paper className="w-full mt-6">
                    <Box className="px-6 py-3 border-b">
                        <Typography variant="h5">Caja</Typography>
                    </Box>
                    <Box>
                        <TableSimple
                            loading={mainResult.loading}
                            data={mainData}
                            addButton={true}
                            filterElement={
                                <Filters
                                    filters={filters}
                                    setFilters={setFilters}
                                    fetchData={fetchData}
                                />
                            }
                            columns={columns}
                            redirectOnSelect={true}
                            columnKey={"name"}
                            buttonElement={
                                <>
                                    <Button
                                        onClick={() => setOpenProfitResumeDialog(true)}
                                        variant="outlined"
                                    >
                                        <PointOfSale fontSize="small" sx={{ marginRight: '4px' }} />PROFIT
                                    </Button>
                                </>
                            }
                        />
                    </Box>
                </Paper>
            </Box>
            <ProfitResumeDialog
                open={openProfitResumeDialog}
                handleClose={() => setOpenProfitResumeDialog(false)}
                filters={filters}
            />
        </>
    );
};

export default Reports;