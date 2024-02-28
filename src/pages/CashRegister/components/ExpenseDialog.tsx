/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Grid } from "@mui/material";
import type { ModalProps } from '@mui/material';
import FieldEdit from "components/Controls/FieldEdit";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { IExpense } from "@types";
import { expenseIns } from "common/helpers";
import { useSendFormApi } from "../../../hooks/useSendFormApi";

interface ExpenseDialogProps {
    openDialog: boolean;
    setOpenDialog: (_: boolean) => void;
    expense: IExpense;
    onSave: () => void
}

const ExpenseDialog: React.FC<ExpenseDialogProps> = ({ openDialog, setOpenDialog, expense, onSave }) => {
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => {
            onSave();
            setOpenDialog(false);
        },
    });

    const { register, handleSubmit, setValue, getValues, formState: { errors }, clearErrors, reset } = useForm<IExpense>({
        defaultValues: {
            expenseid: 0,
            expense_amount: 0,
            expense_date: '',
            description: '',
            evidence_url: '',
            status: 'ACTIVO',
        }
    });

    const registerX = () => {
        register('expenseid');
        register('expense_amount', { validate: (value) => (value ?? 0) > 0 || "El campo es requerido" });
        register('expense_date', { validate: (value) => Boolean(value?.length) || "El campo es requerido" });
        register('description', { validate: (value) => Boolean(value?.length) || "El campo es requerido" });
        register('evidence_url');
    }

    useEffect(() => {
        reset(expense)
        registerX();
    }, [openDialog, setValue, expense]);

    useEffect(() => {
        registerX();
    }, [getValues, register])

    const handleCancelModal: ModalProps['onClose'] = (_, reason) => {
        if (reason !== 'backdropClick') {
            setOpenDialog(false);
            clearErrors();
        }
    }

    const onSubmitDomain = handleSubmit((data: IExpense) => onSubmitData(expenseIns({ ...data, operation: data.expenseid > 0 ? "UPDATE" : "INSERT" })));

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
            <DialogTitle>Egreso {getValues('description')}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} padding={1}>
                    <Grid item xs={12} sm={12}>
                        <FieldEdit
                            label={'Descripción'}
                            valueDefault={getValues('description')}
                            onChange={(value) => setValue('description', `${value}`)}
                            error={errors.description?.message}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FieldEdit
                            label={'Valor'}
                            type="number"
                            valueDefault={getValues('expense_amount')}
                            onChange={(value) => setValue('expense_amount', parseFloat(value ?? "0"))}
                            error={errors.expense_amount?.message}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FieldEdit
                            label={'Fecha'}
                            type="date"
                            valueDefault={getValues('expense_date')}
                            onChange={(value) => setValue('expense_date', `${value}`)}
                            error={errors.expense_date?.message}
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

export default ExpenseDialog;