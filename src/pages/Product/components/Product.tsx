import { Box, Chip, Grid, Paper, Typography } from '@mui/material';
import type { ColumnDef } from '@tanstack/react-table';
import clsx from 'clsx';
import { getProductSel, productIns } from 'common/helpers';
import TableSimple from 'components/Controls/TableSimple';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection } from 'stores/main/actions';
import { IProduct } from '../models';
import { Delete } from '@mui/icons-material';
import { useSendFormApi } from 'hooks/useSendFormApi';
import classes from 'common/constants/classes';

const columns: ColumnDef<IProduct>[] = [
    {
        header: 'Producto',
        accessorKey: 'title',
        enableResizing: true,
        cell: (info) => {
            const { title, image, description } = info.row.original;
            return (
                <Grid container sx={{ gap: '1rem' }}>
                    <Grid item>
                        <Box className="flex items-center">
                            <img
                                src={image || 'https://i.postimg.cc/yYzF74qD/download.jpg'}
                                alt="product"
                                className="w-16 h-16"
                            />
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box>
                            <Typography variant="subtitle1">{title}</Typography>
                            <Typography variant="body2">{description}</Typography>
                        </Box>
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
    },
    {
        header: 'Cantidad',
        accessorKey: 'quantity',
    },
    {
        id: 'estado',
        accessorKey: 'status',
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
    }, [dispatch, fetchData]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_PRODUCT_SEL') {
            setMainData((mainResult.data as IProduct[]) || []);
        }
    }, [mainResult]);

    const deleteRow = (product: IProduct) => onSubmitData(productIns({ ...product, operation: "DELETE" }))

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Productos</Typography>
                </Box>
                <Box>
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
