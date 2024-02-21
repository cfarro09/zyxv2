import { FC, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

type InputProps = {
    label?: string;
    valueDefault?: unknown;
    maxLength?: number;
    fregister?: object;
    error?: string;
    onChange?: (_?: string | null) => number | string | void | null;
    onBlur?: (_?: string | null) => void;
} & Omit<TextFieldProps, 'error' | "onChange">;

const FieldEdit: FC<InputProps> = ({ label, valueDefault = "", onChange, onBlur, error, fregister = {}, variant = "standard", maxLength = 0, inputProps, type, ...rest }) => {
    const [value, setvalue] = useState("");
    useEffect(() => {
        setvalue(`${valueDefault}`);
    }, [valueDefault])

    return (
        <TextField
            {...fregister}
            fullWidth
            label={label}
            value={value}
            type={type}
            style={{ marginTop: 0 }}
            variant={variant}
            size="small"
            helperText={error || null}
            error={Boolean(error)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (maxLength === 0 || e.target.value.length <= maxLength) {
                    const vv = onChange ? onChange(e.target.value) : null;
                    setvalue(vv ? `${vv}` : e.target.value);
                }
            }}
            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                onBlur && onBlur(e.target.value);
            }}
            inputProps={{
                ...inputProps,
                sx: {
                    ...inputProps?.sx,
                    textAlign: type === "number" ? "right" : undefined,
                    "&::placeholder": {
                        textAlign: type === "number" ? "right" : undefined,
                    },
                },
            }}
            {...rest}
        />
    )
}

export default FieldEdit;