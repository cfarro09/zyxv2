import { Box, Chip, Paper, Typography } from '@mui/material';
import { customerIns, getCustomerSel } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection } from 'stores/main/actions';
import clsx from 'clsx';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { ICustomer } from '@types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSendFormApi } from 'hooks/useSendFormApi';
import classes from 'common/constants/classes';

const columns: ColumnDef<ICustomer>[] = [
    {
        header: 'NOMBRE COMPLETO',
        accessorKey: 'name',
    },
    {
        header: 'TIPO DOC.',
        accessorKey: 'document_type',
    },
    {
        header: 'DOCUMENTO',
        accessorKey: 'document',
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
    }
];

export const Purchase: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<ICustomer[]>([]);

    const fetchData = useCallback(() => dispatch(getCollection(getCustomerSel(0))), [dispatch])

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: fetchData,
    });

    useEffect(() => {
        fetchData();
    }, [dispatch, fetchData]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_CLIENT_SEL') {
            setMainData((mainResult.data as ICustomer[]) || []);
        }
    }, [mainResult]);

    const deleteRow = (customer: ICustomer) => onSubmitData(customerIns(customer, "DELETE"))

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
                            description: "Eliminar",
                            Icon: DeleteIcon,
                            onClick: (user) => user && deleteRow(user)
                        }]}
                        columns={columns}
                        redirectOnSelect={true}
                        columnKey={"clientid"}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default Purchase;