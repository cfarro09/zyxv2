import { InfoRounded } from "@mui/icons-material";
import { Autocomplete, Box, CircularProgress, TextField, Tooltip } from "@mui/material";
import type { FormControlProps } from "@mui/material";
import { ObjectZyx } from "@types";
import React, { useEffect, useState } from "react";



type TemplateAutocompleteProps<T> = {
    label?: string;
    valueDefault?: unknown;
    data: T[],
    optionValue: string;
    helperText?: string;
    fregister?: object;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
    onChange?: (_: ObjectZyx | null | T) => void;
    readOnly?: boolean;
    limitTags?: number;
    error?: string;
    multiline?: boolean;
    orderbylabel?: boolean;
} & Omit<FormControlProps, 'onChange' | 'error'>;

export const FieldSelect = <T,>({ multiline = false, error, label, data = [], optionValue, optionDesc, valueDefault = "", onChange, disabled = false, triggerOnChangeOnFirst = false, loading = false, fregister = {}, variant = "standard", readOnly = false, orderbylabel = false, helperText = "" }: TemplateAutocompleteProps<T>) => {
    const [value, setValue] = useState<T | null>(null);
    const [dataG, setDataG] = useState<T[]>([])

    useEffect(() => {
        if (orderbylabel) {
            if (data.length > 0) {
                const datatmp = data.sort((a, b) => `${(a as ObjectZyx)[optionDesc]}`.localeCompare(`${(b as ObjectZyx)[optionDesc]}`));
                setDataG(datatmp);
                return;
            }
        }
        setDataG(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            setValue(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, valueDefault]);

    return (
        <div>
            {(variant === "standard" && !!label) &&
                <Box fontWeight={500} lineHeight="18px" fontSize={14} mb={.5} color="textPrimary" style={{ display: "flex" }}>
                    {label}
                    {!!helperText &&
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Tooltip title={<div style={{ fontSize: 12 }}>{helperText}</div>} arrow placement="top" >
                                <InfoRounded color="action" style={{ width: 15, height: 15, cursor: 'pointer' }} />
                            </Tooltip>
                        </div>
                    }
                </Box>
            }
            <Autocomplete
                filterSelectedOptions
                fullWidth
                {...fregister}
                disabled={disabled}
                value={data?.length > 0 ? value : null}
                onChange={(_, newValue) => {
                    if (readOnly) return;
                    setValue(newValue);
                    onChange && onChange(newValue);
                }}
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
                        helperText={error || null}
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
        </div>
    )
}