import { Box, Chip, Paper, Typography } from '@mui/material';
import { getDomainSel } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection } from 'stores/main/actions';
import clsx from 'clsx';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { IDomain } from '@types';

const classes = {
    successLabel: 'bg-[#dff7e9] text-[#28c76f]',
    pendingLabel: 'bg-[#fff1e3] text-[#ff9f43]',
    inactiveLabel: 'bg-[#f2f2f3] text-[#a8aaae]',
    suspendLabel: 'bg-[#eae8fd] text-[#7367f0]',
    iconBadge: 'w-6 h-6 rounded-full flex items-center justify-center p-5',
};

const columns: ColumnDef<IDomain>[] = [
    {
        header: 'DOMINIO',
        accessorKey: 'domainname',
    },
    {
        header: 'VALORES',
        accessorKey: 'registros',
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

export const Domain: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<IDomain[]>([]);

    useEffect(() => {
        dispatch(getCollection(getDomainSel()));
    }, [dispatch]);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_DOMAIN_SEL') {
            setMainData((mainResult.data as IDomain[]) || []);
        }
    }, [mainResult]);

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Dominios</Typography>
                </Box>
                <Box className="p-6">
                    <TableSimple
                        loading={mainResult.loading}
                        data={mainData}
                        addButton={false}
                        showOptions={false}
                        columns={columns}
                        redirectOnSelect={true}
                        columnKey={"domainname"}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default Domain;
