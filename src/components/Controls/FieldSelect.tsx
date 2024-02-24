/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Button, CircularProgress, ListSubheader, Paper, TextField, Typography } from "@mui/material";
import type { FormControlProps } from "@mui/material";
import { ObjectZyx } from "@types";
import React, { useEffect, useState } from "react";
import { VariableSizeList } from 'react-window';
import type { ListChildComponentProps } from 'react-window';

type TemplateAutocompleteProps<T> = {
    label?: string;
    valueDefault?: unknown;
    data: T[],
    optionValue: string;
    fregister?: object;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
    renderOption?: (_: T) => JSX.Element;
    onChange?: (_: ObjectZyx | null | T) => void;
    readOnly?: boolean;
    limitTags?: number;
    error?: string;
    multiline?: boolean;
    orderbylabel?: boolean;
    placeholder?: string;
    addOption?: boolean;
    addFunction?: (_?: string | null) => void;
} & Omit<FormControlProps, 'onChange' | 'error'>;

const LISTBOX_PADDING_MultiSelect = 8;

const renderRow = (props: ListChildComponentProps) => {
    const { data, index, style } = props;
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: (style.top as number) + LISTBOX_PADDING_MultiSelect,
        },
    });
}

const OuterElementContextMultiSelect = React.createContext({});

const OuterElementTypeMultiSelect = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContextMultiSelect);
    return <div ref={ref} {...props} {...outerProps} />;
});

OuterElementTypeMultiSelect.displayName = "OuterElementTypeMultiSelect";

const useResetCacheMultiSelect = (data: any) => {
    const ref = React.useRef<VariableSizeList>(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
const ListboxComponent = React.forwardRef<HTMLDivElement,  React.HTMLAttributes<HTMLElement>>(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = React.Children.toArray(children);
    const itemCount = itemData.length;
    const itemSize = 48;

    const getChildSize = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCacheMultiSelect(itemCount);

    return (
        <div ref={ref}>
            <OuterElementContextMultiSelect.Provider value={other}>
                <VariableSizeList
                    itemData={itemData}
                    height={getHeight()}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementTypeMultiSelect}
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContextMultiSelect.Provider>
        </div>
    );
});


export const FieldSelect = <T,>({ multiline = false, error, label, data = [], optionValue, optionDesc, valueDefault = "", onChange, disabled = false, triggerOnChangeOnFirst = false, loading = false, fregister = {}, variant = "standard", readOnly = false, orderbylabel = false, renderOption, addOption = false, addFunction, placeholder = '' }: TemplateAutocompleteProps<T>) => {
    const [value, setValue] = useState<T>(null!);
    const [dataG, setDataG] = useState<T[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        if (orderbylabel) {
            if (data.length > 0) {
                const datatmp = data.sort((a, b) => `${(a as ObjectZyx)[optionDesc]}`.localeCompare(`${(b as ObjectZyx)[optionDesc]}`));
                setDataG(datatmp);
                return;
            }
        }
        setDataG(data);
    }, [data]);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionfound = data.find((o: T) => (o as ObjectZyx)[optionValue] === valueDefault);
            if (optionfound) {
                setValue(optionfound);
                if (triggerOnChangeOnFirst)
                    onChange && onChange(optionfound);
            }
        } else {
            setValue(null!);
        }
    }, [data, valueDefault]);

    return (
        <Autocomplete
            filterSelectedOptions
            fullWidth
            {...fregister}
            autoHighlight
            disabled={disabled}
            disableClearable={true}
            value={value!}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            PaperComponent={(options) => (
                <Paper>
                    {options.children}
                    {inputValue !== '' && addOption && (
                        <Button
                            fullWidth
                            color="primary"
                            onMouseDown={() => {
                                // event.preventDefault();
                                addFunction && addFunction(inputValue);
                            }}
                        >
                            <Typography>Crear {inputValue}</Typography>
                        </Button>
                    )}
                </Paper>
            )}
            onChange={(_, newValue) => {
                if (readOnly) return;
                setValue(newValue);
                onChange && onChange(newValue);
            }}
            renderOption={renderOption ? (props, option) => (
                <li {...props}>
                    {renderOption(option)}
                </li>
            ) : undefined}
            getOptionLabel={option => option ? `${(option as ObjectZyx)[optionDesc]}` : ''}
            options={dataG}
            loading={loading}
            ListboxComponent={ListboxComponent}
            size="small"
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={variant !== "standard" && label}
                    variant={variant}
                    multiline={multiline}
                    helperText={error}
                    placeholder={placeholder}
                    error={Boolean(error)}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                        readOnly,
                    }}
                />
            )}
        />
    )
}