import { Add, FirstPage, LastPage, NavigateBefore, NavigateNext } from '@mui/icons-material';
import {
    Button,
    Grid,
    IconButton,
    Menu,
    MenuItem,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { FieldSelect } from './FieldSelect';
import { useState } from 'react';
import { rankItem } from '@tanstack/match-sorter-utils';
import { ObjectZyx } from '@types';
import { normalizePathname } from 'common/helpers';

interface IPageSizes {
    label: string;
    value: number;
}

const pagesSizes: IPageSizes[] = [
    { label: 'Mostrando 2', value: 2 },
    { label: 'Mostrando 10', value: 10 },
    { label: 'Mostrando 20', value: 20 },
    { label: 'Mostrando 30', value: 30 },
    { label: 'Mostrando 40', value: 40 },
    { label: 'Mostrando 50', value: 50 },
];

interface ReactTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T>[];
    redirectOnSelect?: boolean;
    columnKey?: string;
}

const TableSimple = <T extends object>({ data, columns, columnKey, redirectOnSelect }: ReactTableProps<T>) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [globalFilter, setGlobalFilter] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleClose = () => {
        setAnchorEl(null);
    };

    const fuzzyFilter: FilterFn<T> = (row, columnId, value, addMeta) => {
        const itemRank = rankItem(row.getValue(columnId), value);
        addMeta({ itemRank });
        return itemRank.passed;
    };

    const table = useReactTable({
        data,
        columns: columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
    });

    const handlePageSizeChange = (e: IPageSizes) => {
        if (!e) {
            table.setPageSize(Number(10));
            return;
        }
        table.setPageSize(Number(e.value));
    };

    return (
        <>
            <Grid className="border-b flex justify-between pb-4">
                <Grid className="w-52">
                    <FieldSelect
                        label={''}
                        variant="outlined"
                        valueDefault={table.getState().pagination.pageSize}
                        data={pagesSizes}
                        onChange={(e) => handlePageSizeChange(e as IPageSizes)}
                        optionDesc="label"
                        optionValue="value"
                    />
                </Grid>
                <Grid className="flex flex-row-reverse gap-4">
                    <Button
                        className="flex gap-1"
                        id="basic-buttons"
                        variant="contained"
                        onClick={() => {
                            navigate(`${normalizePathname(location.pathname)}/new`);
                        }}
                    >
                        <Add />
                        Nuevo
                    </Button>
                    <Button id="basic-button" aria-haspopup="true" className="px-4 bg-light-grey text-grey">
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
                    <TextField
                        defaultValue={globalFilter || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(String(e.target.value))}
                        size="small"
                        id="search-input"
                        label=""
                        variant="outlined"
                        placeholder="Buscar..."
                    />
                </Grid>
            </Grid>
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
                        <TableRow key={row.id} sx={{ cursor: 'pointer' }} hover>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    onClick={() => {
                                        if (cell.column.id !== 'selection' && redirectOnSelect && columnKey) {
                                            navigate(`${normalizePathname(location.pathname)}/${(row.original as ObjectZyx)[columnKey]}`);
                                        }
                                    }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Box className="flex items-center justify-between px-4 pt-4">
                <Box>
                    <Typography component={'span'} className="text-[#a5a3ae]">
                        {`Pagina ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
                    </Typography>
                </Box>
                <Box className="flex">
                    <IconButton onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
                        <FirstPage />
                    </IconButton>
                    <IconButton onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                        <NavigateBefore />
                    </IconButton>
                    <IconButton onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                        <NavigateNext />
                    </IconButton>
                    <IconButton
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <LastPage />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
};

export default TableSimple;
