import { DesktopMac, Person, VerifiedUser, Visibility } from '@mui/icons-material';
import { Box, Chip, Paper, Typography } from '@mui/material';
import { getUserSel, toTitleCase, userIns } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import dayjs from 'dayjs';
import clsx from 'clsx';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { IUser } from '@types';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSendFormApi } from 'hooks/useSendFormApi';
import classes from 'common/constants/classes';

const columns: ColumnDef<IUser>[] = [
    {
        header: 'USUARIO',
        accessorKey: 'username',
    },
    {
        header: 'NOMBRE',
        accessorKey: 'firstname',
    },
    {
        header: 'APELLIDO',
        accessorKey: 'lastname',
    },
    {
        accessorKey: 'rolename',
        header: 'ROL',
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

    const fetchData = useCallback(() => dispatch(getCollection(getUserSel(0))), [dispatch])

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
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_USERS_SEL') {
            setMainData((mainResult.data as IUser[]) || []);
        }
    }, [mainResult]);

    const deleteRow = (user: IUser) => onSubmitData(userIns({ ...user, password: "", operation: "DELETE" }))

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Usuarios</Typography>
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
                        columnKey={"userid"}
                    />
                </Box>
            </Paper>
        </Box>
    );
};

export default User;
