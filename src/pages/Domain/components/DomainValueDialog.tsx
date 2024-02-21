/* eslint-disable react-hooks/exhaustive-deps */
import { Button, FormControlLabel, Grid } from "@mui/material";
import type { ModalProps } from '@mui/material';
import FieldEdit from "components/Controls/FieldEdit";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IDomainValue } from "@types";
import { domainIns } from "common/helpers";
import { useSendFormApi } from "../../../hooks/useSendFormApi";
import Checkbox from '@mui/material/Checkbox';

interface DomainValueDialogProps {
    openDialog: boolean;
    setOpenDialog: (_: boolean) => void;
    domainValue: IDomainValue;
    onSave: () => void
}

const DomainValueDialog: React.FC<DomainValueDialogProps> = ({ openDialog, setOpenDialog, domainValue, onSave }) => {
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => {
            onSave();
            setOpenDialog(false);
        },
    });

    const { register, handleSubmit, setValue, getValues, formState: { errors }, clearErrors, reset, trigger } = useForm<IDomainValue>({
        defaultValues: {
            domainid: 0,
            domainname: '',
            domaindesc: '',
            domainvalue: '',
            bydefault: false,
        }
    });

    const registerX = () => {
        register('domainid');
        register('domainname');
        register('bydefault');
        register('domaindesc', { validate: (value) => Boolean(value?.length) || "El campo es requerido" });
        register('domainvalue', { validate: (value) => Boolean(value?.length) || "El campo es requerido" });
    }

    useEffect(() => {
        reset(domainValue)
        registerX();
    }, [openDialog, setValue, domainValue]);

    useEffect(() => {
        registerX();
    }, [getValues, register])

    const handleCancelModal: ModalProps['onClose'] = (_, reason) => {
        if (reason !== 'backdropClick') {
            setOpenDialog(false);
            clearErrors();
        }
    }

    const onSubmitDomain = handleSubmit((data: IDomainValue) => onSubmitData(domainIns(data, data.domainid > 0 ? "UPDATE" : "INSERT")));

    return (
        <Dialog
            open={openDialog}
            maxWidth="sm"
            fullWidth
            onClose={handleCancelModal}
            PaperProps={{
                component: 'form',
                onSubmit: onSubmitDomain,
            }}
        >
            <DialogTitle>Dominio {getValues('domainname')}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            label="Por defecto"
                            control={<Checkbox
                                checked={getValues('bydefault')}
                                onChange={(value) => {
                                    setValue('bydefault', value.target.checked)
                                    trigger('bydefault')
                                }}
                            />}
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FieldEdit
                            label={'Descripción'}
                            valueDefault={getValues('domaindesc')}
                            onChange={(value) => setValue('domaindesc', `${value}`)}
                            error={errors.domaindesc?.message}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FieldEdit
                            label={'Valor'}
                            valueDefault={getValues('domainvalue')}
                            onChange={(value) => setValue('domainvalue', `${value}`)}
                            error={errors.domainvalue?.message}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DomainValueDialog;