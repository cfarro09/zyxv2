import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { formatMoney, getProductSel, productIns } from 'common/helpers';
import TableSimple from 'components/Controls/TableSimple';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'hooks';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import { IProduct } from '../models';
import { Delete } from '@mui/icons-material';
import { useSendFormApi } from 'hooks/useSendFormApi';
import classes from 'common/constants/classes';

export const Product: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<IProduct[]>([]);
    const role = useSelector(state => state.login?.validateToken?.user?.rolename);

    const columns = React.useMemo<ColumnDef<IProduct>[]>(
        () => [
            {
                header: 'Producto',
                accessorKey: 'title',
                id: 'title',
                enableResizing: true,
                size: 350,
                cell: (info) => {
                    const { title, image, description } = info.row.original;
                    return (
                        <Grid container sx={{ gap: "8px" }} alignItems={"center"}>
                            <Grid item>
                                <Box className="flex items-center">
                                    <img
                                        src={image || 'https://i.postimg.cc/yYzF74qD/download.jpg'}
                                        alt="product"
                                        className="w-14 h-14"
                                    />
                                </Box>
                            </Grid>
                            <Grid container item sx={{
                                flex: 1, fontSize: "0.875rem", overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }} flexDirection={'column'}>
                                <Typography>{title}</Typography>
                                <Typography fontSize={12}>{description}</Typography>
                            </Grid>
                        </Grid>
                    );
                },
            },
            {
                header: 'Categoria',
                accessorKey: 'category',
                id: 'category',
            },
            {
                header: 'Código',
                accessorKey: 'code',
                id: 'code',
            },
            {
                header: 'Cod. Barra',
                accessorKey: 'barcode',
                id: 'barcode',
            },
            ...(role === "SUPERADMIN" ? [
                {
                    header: 'P Compra',
                    accessorKey: 'purchase_price',
                    meta: {
                        type: "number"
                    },
                    id: 'purchase_price',
                    cell: (info) => "S/ " + formatMoney(`${info.row.original.purchase_price}`),

                } as ColumnDef<IProduct>
            ] : []),
            {
                header: 'P Venta',
                accessorKey: 'selling_price',
                id: 'selling_price',
                meta: {
                    type: "number"
                },
                cell: (info) => "S/ " + formatMoney(`${info.row.original.selling_price}`),

            },
            {
                header: 'En Stock',
                accessorKey: 'store_stock',
                id: 'store_stock',
                meta: {
                    type: "number"
                },
            },
            {
                header: 'En Almacen',
                accessorKey: 'stock',
                id: 'stock',
                meta: {
                    type: "number"
                },
            },
            {
                header: "Estado",
                accessorKey: 'status',
                id: 'status',
                cell: (info) => {
                    const status = info.row.original.status;
                    return (
                        <Box className="flex justify-center">
                            <Chip
                                className={clsx(
                                    status === 'ACTIVO' && classes.successLabel,
                                    status === 'INACTIVO' && classes.inactiveLabel,
                                    status === 'PENDIENTE' && classes.pendingLabel,
                                    'w-24',
                                    'font-medium',
                                )}
                                label={info.row.original.status}
                            />
                        </Box>
                    );
                },
            },

        ],
        [role]
    );


    const fetchData = useCallback(() => dispatch(getCollection(getProductSel(0))), [dispatch])

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: fetchData
    });

    useEffect(() => {
        fetchData();
        return () => {
            dispatch(resetMain());
        }
    }, [dispatch, fetchData]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_PRODUCT_SEL') {
            setMainData((mainResult.data as IProduct[]) || []);
        }
    }, [mainResult]);

    const deleteRow = (product: IProduct) => onSubmitData(productIns({ ...product, operation: "DELETE" }))

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col" sx={{ flex: 1 }}>
            <Paper className="w-full mt-3" sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Productos</Typography>
                </Box>
                <Box sx={{ '& .MuiTableBody-root .MuiTableCell-root': { padding: 1 }, flex: 1, display: "flex", flexDirection: "column" }}>
                    <TableSimple
                        data={mainData}
                        loading={mainResult.loading}
                        columns={columns}
                        redirectOnSelect={true}
                        addButton={true}
                        titlemodule='productos'
                        columnKey={'productid'}
                        showOptions={true}
                        optionsMenu={[{
                            description: "Eliminar",
                            Icon: Delete,
                            onClick: (product) => product && deleteRow(product)
                        }]} />
                </Box>
            </Paper>
        </Box>
    );
};
