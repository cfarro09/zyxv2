import { Box, Paper, Typography } from '@mui/material';
import { cancelPurchaseOrder, getPurchaseOrder } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { IPurchase } from '@types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSendFormApi } from 'hooks/useSendFormApi';
import dayjs from 'dayjs';

const columns: ColumnDef<IPurchase>[] = [
    {
        header: 'Nº ORDEN',
        accessorKey: 'order_number',
    },
    {
        header: 'ALMACEN',
        accessorKey: 'warehouse',
    },
    {
        header: 'PROVEEDOR',
        accessorKey: 'supplier',
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

export const Purchase: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<IPurchase[]>([]);

    const fetchData = useCallback(() => dispatch(getCollection(getPurchaseOrder(0))), [dispatch])

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
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_PURCHASE_ORDER_SEL') {
            setMainData((mainResult.data as IPurchase[]) || []);
        }
    }, [mainResult]);

    const deleteRow = (purchase: IPurchase) => onSubmitData(cancelPurchaseOrder(purchase.purchaseorderid), false, `¿Está seguro de anular la compra ${purchase.order_number}?`, `Compra anulada correctametne.`)

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Ordenes de compra</Typography>
                </Box>
                <Box>
                    <TableSimple
                        loading={mainResult.loading}
                        data={mainData}
                        showOptions={true}
                        addButton={true}
                        optionsMenu={[{
                            description: "Anular",
                            Icon: DeleteIcon,
                            onClick: (purchase) => purchase && deleteRow(purchase),
                            validation: (purchase) => purchase?.status === 'ACTIVO'
                        }]}
                        columns={columns}
                        redirectOnSelect={true}
                        columnKey={"purchaseorderid"}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default Purchase;