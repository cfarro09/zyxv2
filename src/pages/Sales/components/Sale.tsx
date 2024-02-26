import { Box, Button, Chip, Paper, Typography } from '@mui/material';
import { CancelSale, formatMoney, getSaleOrder, initialRange } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { ISale } from '@types';
import { useSendFormApi } from 'hooks/useSendFormApi';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import SaleFilters from './FiltersSale';
import classes from 'common/constants/classes';
import clsx from 'clsx';
import axios from 'axios';
import { PointOfSale, Print } from '@mui/icons-material';
import SalePaymentsResumeDialog from './SalePaymentsResumeDialog';

const fetchPrint = async (sale: ISale) => {
    try {
        const response = await axios.post('http://127.0.0.1:7065/api/drawpdf', sale, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer apis-token-7495.Up1n8BkaSNJc-6yGe2hUo9Ez6032xzHl'
            }
        });
        return response.data;
    } catch (error) {
        return null
    }
};

const columns: ColumnDef<ISale>[] = [
    {
        header: 'Nº ORDEN',
        accessorKey: 'order_number',
    },
    {
        header: 'CLIENTE',
        accessorKey: 'customerdesc',
    },
    {
        header: 'FECHA',
        accessorFn: (row) => row.order_date.substring(0, 10),
    },
    {
        header: 'PRODUCTOS',
        accessorKey: 'quantity',
    },
    {
        header: 'GENERADA POR',
        accessorKey: 'createby',
    },
    {
        id: 'estado',
        accessorKey: 'status',
        header: () => "ESTADO",
        cell: (info) => {
            const status = info.row.original.status;
            return (
                <Box >
                    <Chip
                        className={clsx(
                            status === 'ACTIVO' && classes.successLabel,
                            status === 'INACTIVO' && classes.suspendLabel,
                            status === 'PENDIENTE' && classes.successLabel,
                            status === 'ANULADO' && classes.suspendLabel,
                            'w-24',
                            'font-medium',
                        )}
                        label={info.row.original.status}
                    />
                </Box>
            );
        },
    },
    {
        header: 'TOTAL',
        accessorKey: 'total_amount',
        cell: (info) => <Typography textAlign={'center'}>S/ {formatMoney(`${info.row.original.total_amount}`)}</Typography>,
    },
];

export const Sale: React.FC = () => {
    const dispatch = useDispatch();
    const [openPaymentResumeDialog, setOpenPaymentResumeDialog] = useState(false)
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<ISale[]>([]);
    const [filters, setFilters] = useState<{ startdate: Date; enddate: Date; }>({
        startdate: dayjs().toDate(),
        enddate: dayjs().toDate(),
    })
    const fetchData = useCallback(() => dispatch(getCollection(getSaleOrder(0, filters))), [dispatch, filters])

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: fetchData,
    });

    useEffect(() => {
        return () => {
            dispatch(resetMain());
        }
    }, []);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_SALE_ORDER_SEL') {
            setMainData((mainResult.data as ISale[]) || []);
        }
    }, [mainResult]);

    const deleteRow = (sale: ISale) => onSubmitData(CancelSale(sale.saleorderid), false, `¿Está seguro de anular la venta ${sale.order_number}?`, `Venta anulada correctametne.`)

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Ventas</Typography>
                </Box>
                <Box>
                    <TableSimple
                        loading={mainResult.loading}
                        data={mainData}
                        showOptions={true}
                        addButton={true}
                        optionsMenu={[
                            {
                                description: "Imprimir",
                                Icon: Print,
                                onClick: (sale) => sale && fetchPrint(sale),
                                validation: (sale) => sale?.status === 'ACTIVO'
                            },
                            {
                                description: "Anular",
                                Icon: CloseIcon,
                                onClick: (user) => user && deleteRow(user),
                                validation: (sale) => sale?.status === 'ACTIVO'
                            }
                        ]}
                        filterElement={
                            <ReportFilters
                                filters={filters}
                                setFilters={setFilters}
                                fetchData={fetchData}
                            />
                        }
                        columns={columns}
                        redirectOnSelect={true}
                        columnKey={"saleorderid"}
                        buttonElement={
                            <>
                                <Button
                                    onClick={() => setOpenPaymentResumeDialog(true)}
                                    variant="outlined"
                                >
                                    <PointOfSale fontSize="small" sx={{ marginRight: '4px' }} /> Resumen ventas
                                </Button>
                            </>
                        }
                    />
                </Box>
            </Paper>
            <SalePaymentsResumeDialog
                open={openPaymentResumeDialog}
                handleClose={() => setOpenPaymentResumeDialog(false)}
                filters={filters}
            />
        </Box>
    );
};

export default Sale;