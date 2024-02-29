import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { formatMoney, getProductSel, productIns } from 'common/helpers';
import TableSimple from 'components/Controls/TableSimple';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import { IProduct } from '../models';
import { Delete } from '@mui/icons-material';
import { useSendFormApi } from 'hooks/useSendFormApi';
import classes from 'common/constants/classes';

const columns: ColumnDef<IProduct>[] = [
    {
        header: 'Producto',
        accessorKey: 'title',
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
    },
    {
        header: 'Código',
        accessorKey: 'code',
        maxSize: 100,
    },
    {
        header: 'Cod. Barra',
        accessorKey: 'barcode',
        maxSize: 100,
    },
    {
        header: 'Precio Compra',
        accessorKey: 'purchase_price',
        maxSize: 100,
        cell: (info) => <span>S/ {formatMoney(`${info.row.original.purchase_price}`)}</span>
    },
    {
        header: 'Precio Venta',
        accessorKey: 'selling_price',
        maxSize: 100,
        cell: (info) => <span>S/ {formatMoney(`${info.row.original.selling_price}`)}</span>
    },
    {
        header: 'Cantidad',
        accessorKey: 'stock',
        maxSize: 100,
        cell: (info) => <Typography textAlign={"center"}>{info.row.original.stock}</Typography>
    },
    {
        id: 'estado',
        accessorKey: 'status',
        maxSize: 80,
        header: () => <Box className="text-center">ESTADO</Box>,
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
];

export const Product: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<IProduct[]>([]);

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
