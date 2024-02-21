import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Grid, IconButton, InputAdornment } from "@mui/material";
import FieldEdit from "components/Controls/FieldEdit";
import React, { useEffect, useState } from "react";
import { UseFormSetValue, useForm } from "react-hook-form";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IUser } from "@types";

interface PasswordDialogProps {
    openDialog: boolean;
    setOpenDialog: (_: boolean) => void;
    parentSetValue: UseFormSetValue<IUser>;
}

const PasswordDialog: React.FC<PasswordDialogProps> = ({ openDialog, setOpenDialog, parentSetValue }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register, handleSubmit, setValue, getValues, formState: { errors }, clearErrors } = useForm({
        defaultValues: {
            password: '',
            confirmpassword: '',
        }
    });

    useEffect(() => {
        setValue('password', "");
        setValue('confirmpassword', "");
    }, [openDialog, setValue]);

    useEffect(() => {
        register('password', { validate: (value) => Boolean(value?.length) || "El campo es requerido" });
        register('confirmpassword', {
            validate: {
                validate: (value) => Boolean(value?.length) || "El campo es requerido",
                same: (value) => (getValues('password') === value) || "Contraseñas no coinciden"
            }
        });
    }, [getValues, register])

    const handleCancelModal = () => {
        setOpenDialog(false);
        clearErrors();
    }

    const onSubmitPassword = handleSubmit((data) => {
        parentSetValue('password', data.password);
        setOpenDialog(false);
    });

    return (
        <Dialog
            open={openDialog}
            maxWidth="sm"
            fullWidth
            onClose={handleCancelModal}
            PaperProps={{
                component: 'form',
                onSubmit: onSubmitPassword,
            }}
        >
            <DialogTitle>Ingresar contraseña</DialogTitle>
            <DialogContent>
                <Grid container gap={2}>
                    <Grid item xs>
                        <FieldEdit
                            label={"Contraseña"}
                            variant="outlined"
                            valueDefault={getValues('password')}
                            type={showPassword ? 'text' : 'password'}
                            onChange={(value) => setValue('password', `${value}`)}
                            error={errors?.password?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                    <Grid item xs>
                        <FieldEdit
                            label={"Confirmar contraseña"}
                            variant="outlined"
                            valueDefault={getValues('confirmpassword')}
                            type={showConfirmPassword ? 'text' : 'password'}
                            onChange={(value) => setValue('confirmpassword', `${value}`)}
                            error={errors?.confirmpassword?.message}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelModal}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default PasswordDialog;