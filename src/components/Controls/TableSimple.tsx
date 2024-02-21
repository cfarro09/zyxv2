import { Add, FirstPage, LastPage, MoreVert, NavigateBefore, NavigateNext } from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import { Button, Grid, IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ColumnDef, FilterFn } from '@tanstack/react-table';
import { FieldSelect } from './FieldSelect';
import { useMemo, useState } from 'react';
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

interface ArrayOptionMenu<T> {
    description: string;
    Icon: SvgIconComponent;
    onClick: (_: T | null) => void;
}

interface ReactTableProps<T extends object> {
    data: T[];
    showOptions?: boolean;
    optionsMenu?: ArrayOptionMenu<T>[];
    loading?: boolean;
    addButton?: boolean;
    columns: ColumnDef<T>[];
    redirectOnSelect?: boolean;
    onClickOnRow?: ((_: T | null) => void);
    columnKey?: string;
    filterElement?: React.ReactNode;
    buttonElement?: React.ReactNode;
    enableGlobalFilter?: boolean;
}

const LoadingSkeleton: React.FC<{ columns: number }> = ({ columns }) => {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < columns; i++) {
        items.push(<TableCell key={`table-simple-skeleton-${i}`}><Skeleton /></TableCell>);
    }
    return new Array(3).fill(0).map((_, index) => (<TableRow key={index}>{items}</TableRow>))
};


const TableSimple = <T extends object>({ data, columns, columnKey, redirectOnSelect, loading, showOptions, optionsMenu, addButton, onClickOnRow, filterElement, buttonElement, enableGlobalFilter = true }: ReactTableProps<T>) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelected, setRowSelected] = useState<T | null>(null)
    const navigate = useNavigate();
    const location = useLocation();

    const columns1 = useMemo(() => [
        ...((showOptions && columnKey) ? [{
            accessorKey: columnKey,
            header: "",
            enableResizing: false,
            size: 10,
            minSize: 10,
            maxSize: 10,
            maxWidth: 10,
            minWidth: 10,
            width: 10,
            cell: (info) => {
                return (
                    // <div style={{ whiteSpace: 'nowrap', display: 'flex' }}>
                    <IconButton
                        id={`bott-${info.row.original.userid}`}
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(e.currentTarget);
                            setRowSelected(info.row.original)
                        }}
                    >
                        <MoreVert style={{ color: '#B6B4BA' }} />
                    </IconButton>
                    // </div>
                );
            },
        }] : []),
        ...columns
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [])

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
        columns: columns1,
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
            {filterElement && (
                <Grid className="border-b flex justify-between py-2 px-6">
                    {filterElement}
                </Grid>
            )}
            {enableGlobalFilter && (
                <Grid className="border-b flex flex-row-reverse py-2 px-6">
                    <Grid className="flex flex-row-reverse gap-4">
                        {addButton &&
                            <Button
                                className="flex gap-1"
                                id="basic-buttons"
                                variant="contained"
                                disabled={loading}
                                onClick={() => {
                                    if (onClickOnRow) {
                                        onClickOnRow(null)
                                    } else {
                                        navigate(`${normalizePathname(location.pathname)}/new`)
                                    }
                                }}
                            >
                                <Add />
                                Nuevo
                            </Button>
                        }
                        {buttonElement && buttonElement}
                        {/* <Button id="basic-button" aria-haspopup="true" className="px-4 bg-light-grey text-grey">
                            Exportar
                        </Button> */}
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
            )}
            <Table size='small'>
                <TableHead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <TableCell key={header.id}>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableHead>
                <TableBody>
                    {loading && <LoadingSkeleton columns={table.getHeaderGroups()[0].headers.length} />}
                    {!loading && table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} sx={{ cursor: 'pointer' }} hover>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell
                                    key={cell.id}
                                    onClick={() => {
                                        if (cell.column.id !== 'selection') {
                                            (redirectOnSelect && columnKey) && navigate(`${normalizePathname(location.pathname)}/${(row.original as ObjectZyx)[columnKey]}`);
                                            onClickOnRow && onClickOnRow(row.original);
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
            <Box className="flex items-center justify-between p-6">
                <Box>
                    <Typography component={'span'} className="text-[#a5a3ae]" fontSize={14}>
                        {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
                    </Typography>
                </Box>

                <Box className="flex">
                    <Grid className="w-48 mr-4">
                        <FieldSelect
                            label={''}
                            variant="outlined"
                            valueDefault={table.getState().pagination.pageSize}
                            data={pagesSizes}
                            disabled={loading}
                            onChange={(e) => handlePageSizeChange(e as IPageSizes)}
                            optionDesc="label"
                            optionValue="value"
                        />
                    </Grid>
                    <IconButton
                        onClick={() => table.setPageIndex(0)}
                        disabled={loading || !table.getCanPreviousPage()}>
                        <FirstPage />
                    </IconButton>
                    <IconButton
                        onClick={() => table.previousPage()}
                        disabled={loading || !table.getCanPreviousPage()}>
                        <NavigateBefore />
                    </IconButton>
                    <IconButton
                        onClick={() => table.nextPage()}
                        disabled={loading || !table.getCanNextPage()}>
                        <NavigateNext />
                    </IconButton>
                    <IconButton
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={loading || !table.getCanNextPage()}
                    >
                        <LastPage />
                    </IconButton>
                </Box>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {optionsMenu?.map(({ description, Icon, onClick }, index) => (
                    <MenuItem
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            onClick(rowSelected);
                        }}>
                        <ListItemIcon color="inherit">
                            <Icon width={18} />
                        </ListItemIcon>
                        {description}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default TableSimple;
