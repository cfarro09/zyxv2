import { Box, Paper, Typography } from '@mui/material';
import { getSaleOrder, saleOrderIns } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { ISale } from '@types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSendFormApi } from 'hooks/useSendFormApi';
import dayjs from 'dayjs';

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
        accessorFn: (row) => dayjs(row.order_date).format('DD/MM/YYYY'),
    },
    {
        header: 'TOTAL',
        accessorKey: 'total_amount',
    },
    {
        header: 'PRODUCTOS',
        accessorKey: 'quantity',
    },
];

export const Sale: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<ISale[]>([]);
    
    const fetchData = useCallback(() => dispatch(getCollection(getSaleOrder(0))), [dispatch])

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: fetchData,
    });

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetMain());
        }
    }, [dispatch, fetchData]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_SALE_ORDER_SEL') {
            setMainData((mainResult.data as ISale[]) || []);
        }
    }, [mainResult]);

    const deleteRow = (customer: ISale) => onSubmitData(saleOrderIns({ ...customer, operation: "DELETE" }))

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
                        optionsMenu={[{
                            description: "Eliminar",
                            Icon: DeleteIcon,
                            onClick: (user) => user && deleteRow(user)
                        }]}
                        columns={columns}
                        redirectOnSelect={true}
                        columnKey={"saleorderid"}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default Sale;