import { Add, AdminPanelSettings, DesktopMac, Person, Visibility } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { getCoreRowModel, useReactTable, flexRender, PaginationState } from '@tanstack/react-table';
import { getUserSel, toTitleCase } from 'common/helpers';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, getCollectionPaginated } from 'stores/main/actions';
import dayjs from 'dayjs';
import clsx from 'clsx';

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

type RowProps = {
    id: string;
    original: IUser;
};

type CellProps = {
    getValue: () => ReactNode;
    row: RowProps;
};

const columns = [
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
        header: () => <Box className="pl-11">Rol</Box>,
        cell: (info: CellProps) => {
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
                        {roleid === 1 && <AdminPanelSettings className="w-5 h-5" />}
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
        header: () => <Box className="text-center">ESTADO</Box>,
        cell: (info: CellProps) => {
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
    const mainPaginated = useSelector((state) => state.main.mainPaginated);
    const [mainData, setMainData] = useState<IUser[]>([]);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 2,
    });

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize],
    );

    const table = useReactTable({
        data: mainData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
        debugTable: true,
    });

    useEffect(() => {
        if (!mainPaginated.loading && !mainPaginated.error) {
            // setPageCount(Math.ceil(mainPaginated.count / fetchDataAux.pageSize));
            // settotalrow(mainPaginated.count);
        }
    }, [mainPaginated]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fetchData = () => {
        dispatch(getCollection(getUserSel({ orgid: 1 })));
    };

    const fetchData2 = ({pageSize, pageIndex, filters = null, sorts = null, daterange = null}) => {
        dispatch(getCollectionPaginated(getUserSelPaginated({ orgid: 1, pageSize, pageIndex, filters, sorts, daterange }))
    }

    // useEffect(() => {

    //     fetchData();
    // }, [dispatch]);

    const fetch = () => {
        console.log('fetch');

        fetchData();
    };

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            setMainData((mainResult.data as IUser[]) || []);
        }
    }, [mainResult]);

    useEffect(() => {
        console.log('table.getHeaderGroups()', table.getHeaderGroups());
    }, [table]);

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">Usuarios</Typography>
                </Box>
                <Box className="py-4 px-6 border-b flex flex-row-reverse gap-4">
                    <Button className="flex gap-1" id="basic-buttons" variant="contained" onClick={handleClick}>
                        <Add /> Nuevo usuario
                    </Button>
                    <Button
                        id="basic-button"
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                        className="px-4 bg-light-grey text-grey"
                    >
                        Exportar
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem onClick={handleClose}>CSV</MenuItem>
                        <MenuItem onClick={handleClose}>PDF</MenuItem>
                        <MenuItem onClick={handleClose}>Copiar</MenuItem>
                    </Menu>
                    <TextField size="small" id="search-input" label="" variant="outlined" placeholder="Buscar" />
                </Box>
                <Box className="p-6">
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div>
                        <Button>{'|<'}</Button>
                        <Button>{'<'}</Button>
                        <Button onClick={() => fetch()}>{'>'}</Button>
                        <Button>{'>|'}</Button>
                    </div>
                </Box>
            </Paper>
        </Box>
    );
};

export default User;
