import { DesktopMac, Person, VerifiedUser, Visibility } from '@mui/icons-material';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { getUserSel, toTitleCase } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection } from 'stores/main/actions';
import dayjs from 'dayjs';
import clsx from 'clsx';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';

const classes = {
    successLabel: 'bg-[#dff7e9] text-[#28c76f]',
    pendingLabel: 'bg-[#fff1e3] text-[#ff9f43]',
    inactiveLabel: 'bg-[#f2f2f3] text-[#a8aaae]',
    suspendLabel: 'bg-[#eae8fd] text-[#7367f0]',
    iconBadge: 'w-6 h-6 rounded-full flex items-center justify-center p-5',
};

interface IUser {
    userid: number;
    username: string;
    roleid: number;
    rolename: string;
    document: string;
    document_type: string;
    email?: string;
    status: string;
    createdate: string;
}

const columns: ColumnDef<IUser>[] = [
    {
        header: 'USERID',
        accessorKey: 'userid',
    },
    {
        header: 'USUARIO',
        accessorKey: 'username',
    },
    {
        id: 'rol',
        accessorKey: 'rolename',
        header: () => <Box className="pl-11">Rol</Box>,
        cell: (info) => {
            const rolename = info.row.original.rolename;
            const roleid = info.row.original.roleid;
            return (
                <Box className="flex items-center">
                    <Box
                        className={clsx(
                            classes.iconBadge,
                            roleid === 1 && classes.successLabel,
                            roleid === 2 && classes.inactiveLabel,
                            roleid === 3 && classes.pendingLabel,
                            ![1, 2, 3].includes(roleid) && classes.suspendLabel,
                        )}
                    >
                        {roleid === 1 && <VerifiedUser className="w-5 h-5" />}
                        {roleid === 2 && <DesktopMac className="w-5 h-5" />}
                        {roleid === 3 && <Person className="w-5 h-5" />}
                        {roleid === 4 && <Visibility className="w-5 h-5" />}
                    </Box>
                    <Box className="ml-2">{toTitleCase(rolename)}</Box>
                </Box>
            );
        },
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
        header: 'CORREO',
        accessorKey: 'email',
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
    {
        header: 'FECHA CREACION',
        accessorFn: (row: IUser) => dayjs(row.createdate).format('DD/MM/YYYY'),
    },
];

export const User: React.FC = () => {
    const dispatch = useDispatch();
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<IUser[]>([]);

    const fetchData = () => {
        dispatch(getCollection(getUserSel({ orgid: 1 })));
    };

    useEffect(() => {
        fetch();
    }, []);

    const fetch = () => {
        console.log('fetch');

        fetchData();
    };

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setMainData((mainResult.data as IUser[]) || []);
        }
    }, [mainResult]);

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Usuarios</Typography>
                </Box>
                <Box className="p-6">
                    <TableSimple data={mainData || []} columns={columns} />
                </Box>
            </Paper>
        </Box>
    );
};

export default User;
