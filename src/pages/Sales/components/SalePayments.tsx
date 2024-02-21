import { Add, Delete } from "@mui/icons-material";
import { Avatar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ObjectZyx, ISale, IProductZyx, IPayment } from "@types";
import DropZoneDialog from "components/Controls/DropZoneDialog";
import FieldEdit from "components/Controls/FieldEdit";
import { FieldSelect } from "components/Controls/FieldSelect";
import React, { useState } from "react";
import { Control, FieldErrors, useFieldArray, useFormContext } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { showSnackbar } from "stores/popus/actions";

export const SalePayments: React.FC<{
    control: Control<ISale, object, ISale>;
    loading: boolean;
    listPaymentMethod: ObjectZyx[];
    errors: FieldErrors<ISale>;
    disabled?: boolean;
}> = ({ control, loading, listPaymentMethod, errors, disabled }) => {
    const dispatch = useDispatch();
    const [openDialogEvidence, setOpenDialogEvidence] = useState(false);
    const { setValue, register, getValues, trigger } = useFormContext();
    const [position, setPosition] = useState<number>(0)
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'payments',
    });
    const appendProduct = () => {
        const amountPaid = getValues('payments').reduce((acc: number, item: IPayment) => acc + item.payment_amount, 0);
        const amountToPay = getValues('products').reduce((acc: number, item: IProductZyx) => acc + item.total, 0);
        if (amountPaid < amountToPay) {
            append({
                saleorderpaymentid: 0,
                payment_method: '',
                evidence_url: '',
                status: 'ACTIVO',
                payment_amount: amountToPay - amountPaid
            })
        } else {
            dispatch(showSnackbar({ show: true, severity: "warning", message: "El monto total a pagar ya fue registrado" }))
        }
    }

    const handleChangeValidateAmount = (value: string, position: number) => {
        const amount = parseFloat(value || "0.0");
        const amountToPay = getValues('products').reduce((acc: number, item: IProductZyx) => acc + item.total, 0);
        const amountPaid = getValues('payments').reduce((acc: number, item: IPayment, i: number) => acc + (i === position ? 0 : item.payment_amount), 0);
        if (amountPaid + amount > amountToPay) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: "El monto ingresado excede el monto total a pagar." }))
        }
        const newAmount = amountPaid + amount <= amountToPay ? amount : amountToPay - amountPaid;
        setValue(`payments.${position}.payment_amount`, newAmount);
        trigger(`payments.${position}.payment_amount`);
        return newAmount;
    }

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {!disabled &&
                                    <IconButton
                                        size="small"
                                        disabled={loading}
                                        onClick={appendProduct}
                                    >
                                        <Add />
                                    </IconButton>
                                }
                            </TableCell>
                            <TableCell>{"Método"}</TableCell>
                            <TableCell>{"Cantidad"}</TableCell>
                            <TableCell>{"Evidencia"}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody style={{ marginTop: 5 }}>
                        {fields.map((item, i: number) =>
                            <TableRow key={item.id}>
                                <TableCell width={30}>
                                    {!disabled &&
                                        <IconButton
                                            size="small"
                                            onClick={() => { remove(i) }}
                                        >
                                            <Delete style={{ color: '#777777' }} />
                                        </IconButton>
                                    }
                                </TableCell>
                                <TableCell >
                                    <FieldSelect
                                        label={"Método de pago"}
                                        valueDefault={getValues(`payments.${i}.payment_method`)}
                                        fregister={{
                                            ...register(`payments.${i}.payment_method`, {
                                                validate: (value) => Boolean(value?.length) || "El campo es requerido"
                                            })
                                        }}
                                        disabled={disabled}
                                        variant='outlined'
                                        onChange={(value) => {
                                            setValue(`payments.${i}.payment_method`, (value?.domainvalue as string) ?? "");
                                        }}
                                        error={errors?.payments?.[i]?.payment_method?.message}
                                        data={listPaymentMethod}
                                        optionDesc="domainvalue"
                                        optionValue="domainvalue"
                                    />
                                </TableCell>
                                <TableCell sx={{ width: 200 }}>
                                    <FieldEdit
                                        fregister={{
                                            ...register(`payments.${i}.payment_amount`, {
                                                validate: (value) => (value > 0) || "Debe ser mayor de 0"
                                            })
                                        }}
                                        disabled={disabled}
                                        type="number"
                                        valueDefault={getValues(`payments.${i}.payment_amount`)}
                                        error={errors.payments?.[i]?.payment_amount?.message}
                                        onChange={(value) => handleChangeValidateAmount(value as string, i)}
                                    />
                                </TableCell>
                                <TableCell style={{ width: 200 }}>
                                    <IconButton
                                        disabled={disabled}
                                        onClick={() => {
                                            setPosition(i);
                                            setOpenDialogEvidence(true);
                                        }}
                                    >
                                        <Avatar
                                            src={getValues(`payments.${i}.evidence_url`)}
                                        />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <DropZoneDialog
                url={getValues(`payments.${position}.evidence_url`)}
                onFileUpload={(url) => {
                    setValue(`payments.${position}.evidence_url`, url);
                    trigger(`payments.${position}.evidence_url`);
                }}
                title="Subir evidencia"
                openDialog={openDialogEvidence}
                setOpenDialog={setOpenDialogEvidence}
            />
        </>
    )
}