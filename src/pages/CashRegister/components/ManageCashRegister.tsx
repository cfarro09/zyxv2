/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Grid, Paper, Typography } from '@mui/material';
import { getPaymentsByDateAndMethod } from 'common/helpers';
import { Link, useParams } from 'react-router-dom';
import { IMainProps, ISale, ObjectZyx } from '@types';
import { useMultiData } from 'hooks/useMultiData';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';

interface IDataAux {
    listPayment: ObjectZyx[];
}

const columns: ColumnDef<ObjectZyx>[] = [
    {
        header: 'Nº ORDEN',
        accessorKey: 'order_number',
        id: 'order_number',
    },
    {
        header: 'Cajero',
        accessorKey: 'createdby',
        id: 'createdby',
    },
    {
        header: 'Hora',
        accessorKey: 'createdate',
        id: 'createdate',
        cell: (info) => dayjs(`${info.row.original.createdate}`).format('HH:mm:ss')
    },
    {
        header: 'Monto',
        accessorKey: 'payment_amount',
        id: 'payment_amount',
        meta: {
			type: "number"
		}
    }
];

export const ManageReport: React.FC<IMainProps> = ({ baseUrl }) => {

    const { id } = useParams<{ id?: string }>();
    const [dataAux, setDataAux] = useState<IDataAux>({ listPayment: [] });

    const { giveMeData, loading } = useMultiData<ISale, IDataAux>({
        setDataAux,
        collections: [
            { rb: getPaymentsByDateAndMethod(`${id?.split("--")[0]}`, `${id?.split("--")[1]}`), key: 'UFN_SALE_PAYMENTS_BY_DATE_METHOD', keyData: "listPayment" },
        ],
    });

    useEffect(() => {
        giveMeData();
    }, []);

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to={baseUrl + window.location.search}>
                            <Typography color="secondary" fontWeight={500}>Caja</Typography>
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
                <Paper className="w-full" sx={{ marginTop: 0 }}>
                    <Grid container className="px-6 py-3 border-b">
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="h5">
                                    {id?.replace("--", " con ")}
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box className="p-6">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TableSimple
                                    loading={loading}
                                    data={dataAux.listPayment}
                                    columnKey={"saleorderpaymentid"}
                                    columns={columns}
                                    onClickOnRow={(row) => {
                                        window.open(`/sale_orders/${row?.saleorderid}`)
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box >
        </>
    );
};

export default ManageReport;