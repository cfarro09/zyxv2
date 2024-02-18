/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid } from "@mui/material";
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

interface DomainValueDialogProps {
    openModal: boolean;
    setOpenModal: (_: boolean) => void;
    domainValue: IDomainValue;
    onSave: () => void
}

const DomainValueDialog: React.FC<DomainValueDialogProps> = ({ openModal, setOpenModal, domainValue, onSave }) => {
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => {
            onSave();
            setOpenModal(false);
        },
    });
    
    const { register, handleSubmit, setValue, getValues, formState: { errors }, clearErrors, reset } = useForm<IDomainValue>({
        defaultValues: {
            domainid: 0,
            domainname: '',
            domaindesc: '',
            domainvalue: '',
        }
    });

    const registerX = () => {
        register('domainid');
        register('domainname');
        register('domaindesc', { validate: (value) => Boolean(value?.length) || "El campo es requerido" });
        register('domainvalue', { validate: (value) => Boolean(value?.length) || "El campo es requerido" });
    }

    useEffect(() => {
        reset(domainValue)
        registerX();
    }, [openModal, setValue, domainValue]);

    useEffect(() => {
        registerX();
    }, [getValues, register])

    const handleCancelModal = () => {
        setOpenModal(false);
        clearErrors();
    }

    const onSubmitDomain = handleSubmit((data: IDomainValue) => {
        onSubmitData(domainIns(data, data.domainid > 0 ? "UPDATE" : "INSERT"))
    });

    return (
        <Dialog
            open={openModal}
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
                <Button onClick={handleCancelModal}>Cancelar</Button>
                <Button type="submit">Guardar</Button>
            </DialogActions>
        </Dialog>
    )
}

export default DomainValueDialog;