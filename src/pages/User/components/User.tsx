import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, Typography } from '@mui/material';
import { rankItem } from '@tanstack/match-sorter-utils';
import { getCoreRowModel, useReactTable, getFilteredRowModel } from '@tanstack/react-table';
import React, { ReactNode } from 'react';

type Person = {
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    status: string;
    progress: number;
};

const defaultData: Person[] = [
    {
        firstName: 'tanner',
        lastName: 'linsley',
        age: 24,
        visits: 100,
        status: 'In Relationship',
        progress: 50,
    },
    {
        firstName: 'tandy',
        lastName: 'miller',
        age: 40,
        visits: 40,
        status: 'Single',
        progress: 80,
    },
    {
        firstName: 'joe',
        lastName: 'dirte',
        age: 45,
        visits: 20,
        status: 'Complicated',
        progress: 10,
    },
];

type CellProps = {
    getValue: () => ReactNode;
};

const columns = [
    {
        accessorKey: 'lastName',
        cell: (props: CellProps) => <span>{props.getValue()}</span>,
    },
    {
        accessorKey: 'firstName',
        cell: (props: CellProps) => <span>{props.getValue()}</span>,
    },
    {
        id: 'fullName',
        accessorFn: (row: Person) => `${row.firstName} ${row.lastName}`,
    },
];

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    // Rank the item
    const itemRank = rankItem(row.getValue(columnId), value);

    // Store the itemRank info
    addMeta({
        itemRank,
    });

    // Return if the item should be filtered in/out
    return itemRank.passed;
};

export const User: React.FC = () => {
    const [data, setData] = React.useState(() => [...defaultData]);
    const [globalFilter, setGlobalFilter] = React.useState('');
    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        getCoreRowModel: getCoreRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: fuzzyFilter,
    });

    return (
        <Grid
            sx={{
                display: 'flex',
                maxWidth: '1440px',
                marginRight: 'auto',
                marginLeft: 'auto',
                flexDirection: 'column',
            }}
        >
            <Paper
                sx={{
                    marginTop: '2rem',
                }}
            >
                <Grid
                    sx={{
                        padding: '1.5rem',
                        borderBottom: '1px solid #dbdade',
                    }}
                >
                    <Typography variant="h5">Search Filter</Typography>
                    <Grid
                        sx={{
                            display: 'flex',
                            // justifyContent: 'space-between',
                            gap: '1rem',
                            flexDirection: {
                                xs: 'column',
                                sm: 'row',
                            },
                        }}
                    >
                        <FormControl
                            sx={{
                                maxWidth: {
                                    sm: 250,
                                },
                                width: {
                                    sm: '33%',
                                },
                            }}
                        >
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Age"
                                onChange={() => console.log('change')}
                                variant="outlined"
                            >
                                <MenuItem value="">
                                    <em>Edad</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                maxWidth: {
                                    sm: 250,
                                },
                                width: {
                                    sm: '33%',
                                },
                            }}
                        >
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={10}
                                label="Age"
                                onChange={() => console.log('change')}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl
                            sx={{
                                maxWidth: {
                                    sm: 250,
                                },
                                width: {
                                    sm: '33%',
                                },
                            }}
                        >
                            <InputLabel id="demo-simple-select-label">Age</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={10}
                                label="Age"
                                onChange={() => console.log('change')}
                            >
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid
                    sx={{
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid #dbdade',
                    }}
                >
                    <Typography>Download</Typography>
                </Grid>
                <Grid
                    sx={{
                        padding: '1.5rem',
                    }}
                >
                    <Typography>Table</Typography>
                </Grid>
            </Paper>
        </Grid>
        // <div className="p-2">
        //     <Grid>
        //         <TextField
        //             margin="normal"
        //             required
        //             fullWidth
        //             id="username"
        //             label="Usuario"
        //             name="username"
        //             autoComplete="username"
        //             onChange={(e) => setGlobalFilter(e.target.value)}
        //             defaultValue={globalFilter ?? ''}
        //         />
        //     </Grid>
        //     <table>
        //         <thead>
        //             {table.getHeaderGroups().map((headerGroup) => (
        //                 <tr key={headerGroup.id}>
        //                     {headerGroup.headers.map((header) => (
        //                         <th key={header.id}>
        //                             {header.isPlaceholder
        //                                 ? null
        //                                 : flexRender(header.column.columnDef.header, header.getContext())}
        //                         </th>
        //                     ))}
        //                 </tr>
        //             ))}
        //         </thead>
        //         <tbody>
        //             {table.getRowModel().rows.map((row) => (
        //                 <tr key={row.id}>
        //                     {row.getVisibleCells().map((cell) => (
        //                         <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
        //                     ))}
        //                 </tr>
        //             ))}
        //         </tbody>
        //     </table>
        // </div>
    );
};

export default User;
