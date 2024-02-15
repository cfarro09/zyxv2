import { InfoRounded } from "@mui/icons-material";
import { Autocomplete, Box, CircularProgress, TextField, Tooltip } from "@mui/material";
import type { FormControlProps } from "@mui/material";
import React, { useEffect, useState } from "react";

interface ObjectZyx {
    [key: string]: string | number | boolean | null;
}
type TemplateAutocompleteProps = {
    label?: string;
    valueDefault?: unknown;
    data: ObjectZyx[],
    optionValue: string;
    helperText?: string;
    fregister?: ObjectZyx;
    optionDesc: string;
    loading?: boolean;
    triggerOnChangeOnFirst?: boolean;
    onChange?: (_: ObjectZyx | null) => void;
    readOnly?: boolean;
    limitTags?: number;
    multiline?: boolean;
    orderbylabel?: boolean;
} & FormControlProps

export const FieldSelect: React.FC<TemplateAutocompleteProps> = ({ multiline = false, error, label, data = [], optionValue, optionDesc, valueDefault = "", onChange, disabled = false, triggerOnChangeOnFirst = false, loading = false, fregister = {}, variant = "standard", readOnly = false, orderbylabel = false, helperText = "" }) => {
    const [value, setValue] = useState<ObjectZyx | null>(null);
    const [dataG, setDataG] = useState<ObjectZyx[]>([])

    useEffect(() => {
        if (orderbylabel) {
            if (data.length > 0) {
                const datatmp = data.sort((a, b) => `${a[optionDesc]}`.localeCompare(`${b[optionDesc]}`));
                setDataG(datatmp);
                return;
            }
        }
        setDataG(data);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => {
        if (valueDefault && data.length > 0) {
            const optionfound = data.find((o: ObjectZyx) => o[optionValue] === valueDefault);
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
                    setValue(newValue as (ObjectZyx | null));
                    onChange && onChange(newValue as (ObjectZyx | null));
                }}
                getOptionLabel={option => option ? `${option[optionDesc]}` : ''}
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
                        error={!!error}
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