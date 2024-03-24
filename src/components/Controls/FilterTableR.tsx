import React, { useState } from 'react';
import type { Column } from '@tanstack/react-table';
import { IconButton, Input, InputProps, Menu, MenuItem, Tooltip } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

interface IFilter {
    value: string;
    operator: string;
    type: string;
}

export type ValueType = "string" | "number" | "date"

interface IFilterTable {
    column: Column<any, unknown>;
    type?: ValueType;
}

const optionsFilters = {
    date: [
        { key: 'equals', description: 'Igual a' },
        { key: 'notequals', description: 'No igual a' },
        { key: 'contains', description: 'Contiene' },
        { key: 'notcontains', description: 'No contiene' },
        { key: 'isempty', description: 'Es vacio' },
        { key: 'isnotempty', description: 'No es vacio' },
    ],
    string: [
        { key: 'equals', description: 'Igual a' },
        { key: 'notequals', description: 'No igual a' },
        { key: 'contains', description: 'Contiene' },
        { key: 'notcontains', description: 'No contiene' },
        { key: 'isempty', description: 'Es vacio' },
        { key: 'isnotempty', description: 'No es vacio' },
    ],
    number: [
        { key: 'equals', description: 'Igual a' },
        { key: 'notequals', description: 'No igual' },
        { key: 'greater', description: 'Mayor que' },
        { key: 'greaterorequals', description: 'Mayor igual que' },
        { key: 'less', description: 'Menor que' },
        { key: 'lessorequals', description: 'Menor igual que' },
        { key: 'isempty', description: 'Es cero' },
        { key: 'isnotempty', description: 'No es cero' },
    ]
}

const getDescriptionFromOption = (type: ValueType, key: string) => {
    return optionsFilters[type].find(x => x.key === key)?.description ?? "";
}

// A debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string
    onChange: (value: string) => void
    debounce?: number
} & Omit<InputProps, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <Input
            {...props}
            value={value}
            onChange={e => setValue(e.target.value)}
            fullWidth
        />
    )
}

export const filterCellValue = (valuex: string | number, filterValue: IFilter) => {
    const { value, operator, type } = filterValue;
    const cellvalue = valuex === null || valuex === undefined ? "" : valuex;

    if (value === '' && !['isempty', 'isnotempty', 'isnull', 'isnotnull'].includes(operator))
        return true;

    switch (type) {
        case "number":
        case "number-centered":
            switch (operator) {
                case 'greater':
                    return Number(cellvalue) > Number(value);
                case 'greaterorequals':
                    return Number(cellvalue) >= Number(value);
                case 'less':
                    return Number(cellvalue) < Number(value);
                case 'lessorequals':
                    return Number(cellvalue) <= Number(value);
                case 'isnull':
                    return !Number(cellvalue || "0");
                case 'isnotnull':
                    return !!Number(cellvalue || "0");
                case 'notequals':
                    return Number(cellvalue) !== Number(value);
                case 'equals':
                default:
                    return Number(cellvalue) === Number(value);
            }
        case "string":
        default:
            switch (operator) {
                case 'equals':
                    return cellvalue === value;
                case 'notequals':
                    return cellvalue !== value;
                case 'isempty':
                    return cellvalue === '';
                case 'isnotempty':
                    return cellvalue !== '';
                case 'isnull':
                    return cellvalue === null;
                case 'isnotnull':
                    return cellvalue !== null;
                case 'notcontains':
                    return !(`${cellvalue}`).toLowerCase().includes(value.toLowerCase());
                case 'contains':
                default:
                    return (`${cellvalue}`).toLowerCase().includes(value.toLowerCase());
            }
    }
};

function FilterTableR({ column: { setFilterValue, getFilterValue }, type = "string" }: Readonly<IFilterTable>) {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const columnFilterValue = getFilterValue() as IFilter;
    const [value, setValue] = useState<string>(columnFilterValue?.value || "");
    const [operator, setOperator] = useState(type === "number" ? "equals" : "contains");

    const setFilter = (filter: any) => {
        setFilterValue(filter);
    }

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };
    const handleClickItemMenu = (op: any) => {
        setAnchorEl(null);
        if (['isempty', 'isnotempty', 'isnull', 'isnotnull'].includes(op) || !!value) {
            setFilter({ value, operator: op, type });
        }
        setOperator(op)
    };

    const handleClickMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    return (
        <div style={{ display: "flex", gap: 2 }}>
            <Tooltip title={getDescriptionFromOption(type, operator)}>
                <IconButton
                    onClick={handleClickMenu}
                    sx={{ marginLeft: "-8px" }}
                    size="small"
                >
                    <FilterAltIcon
                        style={{ cursor: 'pointer' }}
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        color="action"
                        fontSize="small"
                    />
                </IconButton>
            </Tooltip>
            <DebouncedInput
                type="text"
                value={value}
                onChange={value => {
                    setFilter({ value, operator, type });
                    setValue(value)
                }}
                placeholder={`Filtrar...`}
            />
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
            >
                {optionsFilters[type].map(option => (
                    <MenuItem key={option.key} selected={option.key === operator} onClick={() => handleClickItemMenu(option.key)}>
                        {option.description}
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
}

export default FilterTableR;