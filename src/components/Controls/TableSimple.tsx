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
import { ObjectZyx } from '@types';
import { exportExcel, normalizePathname } from 'common/helpers';
import DownloadIcon from '@mui/icons-material/Download';
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
    titlemodule?: string;
    showOptions?: boolean;
    optionsMenu?: ArrayOptionMenu<T>[];
    loading?: boolean;
    addButton?: boolean;
    columns: ColumnDef<T>[];
    download?: boolean;
    redirectOnSelect?: boolean;
    onClickOnRow?: ((_: T | null) => void);
    columnKey?: string;
    filterElement?: React.ReactNode;
    buttonsElement?: React.ReactNode[];
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

const TableSimple = <T extends object>({ data, columns, columnKey, redirectOnSelect, loading, showOptions, optionsMenu, addButton, onClickOnRow, filterElement, buttonsElement = [], enableGlobalFilter = true, selection, rowsSelected, setRowsSelected, titlemodule, download = true }: ReactTableProps<T>) => {
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

    const containsFilter: FilterFn<T> = (row, columnId, value, addMeta) => {
        const cellValue = `${row.getValue(columnId)}`.toLowerCase();
        const searchValue = value.toString().toLowerCase();
        const isMatch = cellValue.includes(searchValue);
        addMeta({ isMatch });
        return isMatch;
    };

    const table = useReactTable({
        data,
        columns: columns1,
        enableMultiRowSelection: true,
        filterFns: { contains: containsFilter },
        state: { globalFilter, rowSelection: rowsSelected, sorting, },
        getRowId: (row, relativeIndex) => columnKey ? `${(row as ObjectZyx)[columnKey]}` : `${relativeIndex}`,
        onRowSelectionChange: setRowsSelected,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: containsFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        autoResetPageIndex: false
    });

    useEffect(() => {
        if (enableGlobalFilter) {
            const params = new URLSearchParams(location.search);
            const f = params.get('f');
            const page = params.get('page');
            f && setGlobalFilter(f);
            page && table.setPageIndex(Number(page));
        }
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
                <Grid className="border-b flex justify-between py-2 px-3">
                    {filterElement}
                </Grid>
            )}
            {enableGlobalFilter && (
                <Grid container className="border-b flex-row-reverse py-2 px-3" spacing={1}>
                    {addButton &&
                        <Grid item xs={6} sm={4} md={2} lg={2}>
                            <Button
                                className="flex gap-1"
                                id="basic-buttons"
                                fullWidth
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
                                <Add /> Nuevo
                            </Button>
                        </Grid>
                    }
                    {download &&
                        <Grid item xs={6} sm={4} md={2} lg={2}>
                            <Button
                                className="flex gap-1"
                                id="basic-buttons"
                                fullWidth
                                variant="contained"
                                disabled={loading}
                                onClick={() => {
                                    exportExcel(String(titlemodule || '') + "Report", table.getFilteredRowModel().rows.map(x => x.original), columns)
                                }}
                            >
                                <DownloadIcon /> Descargar
                            </Button>
                        </Grid>
                    }
                    {buttonsElement.map(button => (
                        <Grid item xs={6} sm={4} md={2} lg={2}>
                            {button}
                        </Grid>
                    ))}
                    <Grid item xs={12} sm={4} md={3} lg={3}>
                        <TextField
                            value={globalFilter}
                            fullWidth
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
            <TableContainer style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", overflowY: "auto" }}>
                <Table size='small' sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        sortDirection={false}
                                        sx={{ width: header.column.getSize(), textAlign: header.column.columnDef.meta?.align || 'left' }}
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
                                        sx={{
                                            width: cell.column.getSize(),
                                            textAlign: (typeof cell.getValue() === 'number' ? "right" : undefined),
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                        onClick={() => {
                                            if (cell.column.id !== 'selection') {
                                                (redirectOnSelect && columnKey) && handleNavigate(`${normalizePathname(location.pathname)}/${(row.original as ObjectZyx)[columnKey]}`);
                                                onClickOnRow && onClickOnRow(row.original);
                                            }
                                        }}
                                        title={cell.getValue() + ""}
                                    >{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box className="flex items-center justify-between p-6 flex-wrap">
                <Box>
                    <Typography component={'span'} className="text-[#a5a3ae]" fontSize={14}>
                        {`Página ${table.getState().pagination.pageIndex + 1} de ${table.getPageCount()}`}
                    </Typography>
                </Box>
                <Box className="flex flex-wrap">
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
                    <Box className="flex">
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
