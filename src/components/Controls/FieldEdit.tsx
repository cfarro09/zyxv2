import { FC, useEffect, useState } from 'react';
import { InfoRounded } from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

type InputProps = {
    label?: string;
    valueDefault?: unknown;
    maxLength?: number;
    helperText?: string;
    fregister?: object;
    error?: string;
    onChange?: (_?: string | null) => void;
    onBlur?: (_?: string | null) => void;
} & Omit<TextFieldProps, 'error'>;

const FieldEdit: FC<InputProps> = ({ label, valueDefault = "", onChange, onBlur, error, fregister = {}, variant = "standard", maxLength = 0, helperText = "", ...rest }) => {
    const [value, setvalue] = useState("");

    useEffect(() => {
        setvalue(`${valueDefault}`);
    }, [valueDefault])

    return (
        <div>
            {/* {(variant === "standard" && !!label) &&
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
            } */}
            <TextField
                {...fregister}
                color="primary"
                fullWidth
                label={label}
                value={value}
                style={{ marginTop: 0 }}
                variant={variant}
                size="small"
                helperText={error || null}
                error={Boolean(error)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (maxLength === 0 || e.target.value.length <= maxLength) {
                        setvalue(e.target.value);
                        onChange && onChange(e.target.value);
                    }
                }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    onBlur && onBlur(e.target.value);
                }}
                {...rest}
            />
        </div>
    )
}

export default FieldEdit;