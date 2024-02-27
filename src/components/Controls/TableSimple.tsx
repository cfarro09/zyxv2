import React, { useEffect, useMemo, useState } from 'react';
import { Add, FirstPage, LastPage, MoreVert, NavigateBefore, NavigateNext } from '@mui/icons-material';
import type { SvgIconComponent } from '@mui/icons-material';
import { Button, Checkbox, Grid, IconButton, ListItemIcon, Menu, MenuItem, Skeleton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, TextField, Typography } from '@mui/material';
import type { CheckboxProps } from '@mui/material';
import { Box } from '@mui/system';
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useLocation, useNavigate } from 'react-router-dom';
import type { ColumnDef, FilterFn, OnChangeFn, SortingState, SortDirection } from '@tanstack/react-table';
import { FieldSelect } from './FieldSelect';
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
    validation?: (_: T | null) => boolean;
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
    selection?: boolean;
    setRowSelection?: ObjectZyx;
    rowsSelected?: Record<string, boolean>
    setRowsSelected?: OnChangeFn<Record<string, boolean>>,
}

const LoadingSkeleton: React.FC<{ columns: number }> = ({ columns }) => {
    const items: React.ReactNode[] = [];
    for (let i = 0; i < columns; i++) {
        items.push(<TableCell key={`table-simple-skeleton-${i}`}><Skeleton /></TableCell>);
    }
    return new Array(3).fill(0).map((_, index) => (<TableRow key={index}>{items}</TableRow>))
};

// Extiende CheckboxProps para incluir la propiedad indeterminate personalizada.
interface IndeterminateCheckboxProps extends CheckboxProps {
    indeterminate?: boolean;
    className?: string;
}

function IndeterminateCheckbox({ indeterminate, className = '', ...rest }: IndeterminateCheckboxProps) {
    const ref = React.useRef<HTMLInputElement>(null!);

    React.useEffect(() => {
        if (ref.current) {
            ref.current.indeterminate = typeof indeterminate === 'boolean' && indeterminate;
        }
    }, [indeterminate]);

    return (
        <Checkbox
            size='small'
            inputRef={ref}
            color="primary"
            className={`${className} cursor-pointer`}
            {...rest}
        />
    );
}

const TableSimple = <T extends object>({ data, columns, columnKey, redirectOnSelect, loading, showOptions, optionsMenu, addButton, onClickOnRow, filterElement, buttonElement, enableGlobalFilter = true, selection, rowsSelected, setRowsSelected }: ReactTableProps<T>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelected, setRowSelected] = useState<T>(null!)
    const navigate = useNavigate();
    const location = useLocation();

    const columns1 = useMemo(() => [
        ...((selection) ? [
            {
                id: 'selection',
                size: 50,
                maxSize: 50,
                header: ({ table }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: table.getIsAllRowsSelected(),
                            indeterminate: table.getIsSomeRowsSelected(),
                            onChange: table.getToggleAllRowsSelectedHandler(),
                        }}
                    />
                ),
                cell: ({ row }) => (
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                ),
            },
        ] as ColumnDef<T>[] : []),
        ...((showOptions && columnKey) ? [{
            accessorKey: columnKey,
            header: "",
            size: 40,
            maxSize: 40,
            cell: (info) => {
                return (
                    <IconButton
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
                );
            },
        } as ColumnDef<T>] : []),
        ...columns,
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
        enableMultiRowSelection: true,
        filterFns: { fuzzy: fuzzyFilter },
        state: { globalFilter, rowSelection: rowsSelected, sorting, },
        getRowId: (row, relativeIndex) => columnKey ? `${(row as ObjectZyx)[columnKey]}` : `${relativeIndex}`,
        onRowSelectionChange: setRowsSelected,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false
    });

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const f = params.get('f');
        const page = params.get('page');
        f && setGlobalFilter(f);
        page && table.setPageIndex(Number(page));
    }, [table])

    useEffect(() => {
        if (table.getState().pagination.pageIndex !== 0) table.setPageIndex(0);
    }, [globalFilter])

    const handlePageSizeChange = (e: IPageSizes) => {
        if (!e) {
            table.setPageSize(Number(10));
            return;
        }
        table.setPageSize(Number(e.value));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const url = new URL(window.location.href);
        if ((e.target.value).trim() !== '') {
            url.searchParams.set('f', e.target.value);
        } else {
            url.searchParams.delete('f');
        }
        window.history.pushState({}, '', url.toString());
    }

    const handleChangePage = (pageIndex: number) => {
        const url = new URL(window.location.href);
        if (pageIndex !== 0) {
            url.searchParams.set('page', String(pageIndex));
            window.history.pushState({}, '', url.toString());
        } else {
            url.searchParams.delete('page');
            window.history.pushState({}, '', url.toString());
        }
    }

    const handleNavigate = (url: string) => {
        const urlSearchParams = window.location.search
        navigate(url + urlSearchParams)
    }

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
                        <TextField
                            value={globalFilter}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(String(e.target.value))}
                            onBlur={handleBlur}
                            disabled={loading}
                            size="small"
                            id="search-input"
                            label=""
                            variant="outlined"
                            placeholder="Buscar..."
                        />
                    </Grid>
                </Grid>
            )}
            <TableContainer>
                <Table size='small' sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        sortDirection={false}
                                        sx={{ width: header.column.getSize() }}
                                    >
                                        <TableSortLabel
                                            active={!!header.column.getIsSorted()}
                                            direction={(header.column.getIsSorted() as SortDirection) || 'asc'}
                                            onClick={header.column.getToggleSortingHandler()}
                                        >
                                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                        </TableSortLabel>
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
                                        sx={{ width: cell.column.getSize(), textAlign: (typeof cell.getValue() === 'number' ? "right" : undefined) }}
                                        onClick={() => {
                                            if (cell.column.id !== 'selection') {
                                                (redirectOnSelect && columnKey) && handleNavigate(`${normalizePathname(location.pathname)}/${(row.original as ObjectZyx)[columnKey]}`);
                                                onClickOnRow && onClickOnRow(row.original);
                                            }
                                        }}
                                    >{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
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
                        onClick={() => {
                            table.setPageIndex(0);
                            handleChangePage(0);
                        }}
                        disabled={loading || !table.getCanPreviousPage()}>
                        <FirstPage />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            table.previousPage();
                            handleChangePage(table.getState().pagination.pageIndex - 1);
                        }}
                        disabled={loading || !table.getCanPreviousPage()}>
                        <NavigateBefore />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            table.nextPage();
                            handleChangePage(table.getState().pagination.pageIndex + 1);
                        }}
                        disabled={loading || !table.getCanNextPage()}>
                        <NavigateNext />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            table.setPageIndex(table.getPageCount() - 1);
                            handleChangePage(table.getPageCount() - 1);
                        }}
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
                {optionsMenu?.map(({ description, Icon, onClick, validation }, index) => (
                    <MenuItem
                        key={index}
                        disabled={validation && !validation(rowSelected)}
                        onClick={(e) => {
                            e.stopPropagation();
                            setAnchorEl(null);
                            onClick(rowSelected);
                        }}
                    >
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
