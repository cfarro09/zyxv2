import { FC, useEffect, useState } from 'react';
import { InfoRounded } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { Dictionary } from '@types';

type InputProps = {
    label?: string;
    valueDefault?: unknown;
    maxLength?: number;
    helperText?: string;
    fregister?: Dictionary;
    onChange?: (_: any, _1?: any | null) => void;
    onBlur?: (_: any, _1?: any | null) => void;
} & TextFieldProps;

const FieldEdit: FC<InputProps> = ({ label, valueDefault = "", onChange, onBlur, error, fregister = {}, variant = "standard", maxLength = 0, helperText = "", ...rest }) => {
    const [value, setvalue] = useState("");

    useEffect(() => {
        setvalue(`${valueDefault}`);
    }, [valueDefault])

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
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                label={variant !== "standard" && label}
                value={value}
                variant={variant}
                error={!!error}
                size="small"
                helperText={error || null}
                onChange={(e) => {
                    if (maxLength === 0 || e.target.value.length <= maxLength) {
                        setvalue(e.target.value);
                        onChange && onChange(e.target.value);
                    }
                }}
                onBlur={(e) => {
                    onBlur && onBlur(e.target.value);
                }}
                {...rest}
            />
        </div>
    )
}

export default FieldEdit;