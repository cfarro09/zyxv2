/* eslint-disable react-hooks/exhaustive-deps */
import { Autocomplete, Button, CircularProgress, Paper, TextField, Typography } from "@mui/material";
import type { FormControlProps } from "@mui/material";
import { ObjectZyx } from "@types";
import React, { useEffect, useState } from "react";

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