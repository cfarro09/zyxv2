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
}> = ({ control, loading, listPaymentMethod, errors }) => {
    const dispatch = useDispatch();
    const [openDialogEvidence, setOpenDialogEvidence] = useState(false);
    const { setValue, register, getValues, trigger } = useFormContext();
    const [position, setPosition] = useState<number>(0)
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'payments',
    });
    const appendProduct = () => {
        const amountPaid = getValues('payments').reduce((acc: number, item: IPayment) => acc + item.amount, 0);
        const amountToPay = getValues('products').reduce((acc: number, item: IProductZyx) => acc + item.subtotal, 0);
        if (amountPaid < amountToPay) {
            append({
                paymentid: 0,
                paymentMethod: '',
                evidence: '',
                amount: amountToPay - amountPaid
            })
        } else {
            dispatch(showSnackbar({ show: true, severity: "warning", message: "El monto total a pagar ya fue registrado" }))
        }
    }

    const handleChangeValidateAmount = (value: string, position: number) => {
        const amount = parseFloat(value || "0.0");
        const amountToPay = getValues('products').reduce((acc: number, item: IProductZyx) => acc + item.subtotal, 0);
        const amountPaid = getValues('payments').reduce((acc: number, item: IPayment, i: number) => acc + (i === position ? 0 : item.amount), 0);
        if (amountPaid + amount > amountToPay) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: "El monto ingresado excede el monto total a pagar." }))
        }
        console.log("amountPaid", amountPaid, "amount", amount, "newAmount", amountPaid + amount <= amountToPay ? amount : amountToPay - amountPaid);

        const newAmount = amountPaid + amount <= amountToPay ? amount : amountToPay - amountPaid;
        setValue(`payments.${position}.amount`, newAmount);
        trigger(`payments.${position}.amount`);
        console.log("newAmount", newAmount)
        return newAmount;
    }

    console.log("getValues(`payments.${i}.amount`)", getValues(`payments.${0}.amount`))

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <IconButton
                                    size="small"
                                    disabled={loading}
                                    onClick={appendProduct}
                                >
                                    <Add />
                                </IconButton>
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
                                    <div style={{ display: 'flex' }}>
                                        <IconButton
                                            size="small"
                                            onClick={() => { remove(i) }}
                                        >
                                            <Delete style={{ color: '#777777' }} />
                                        </IconButton>
                                    </div>
                                </TableCell>
                                <TableCell >
                                    <FieldSelect
                                        label={"Método de pago"}
                                        valueDefault={getValues(`payments.${i}.paymentMethod`)}
                                        fregister={{
                                            ...register(`payments.${i}.paymentMethod`, {
                                                validate: (value) => Boolean(value?.length) || "El campo es requerido"
                                            })
                                        }}
                                        variant='outlined'
                                        onChange={(value) => {
                                            setValue(`payments.${i}.paymentMethod`, (value?.domainvalue as string) ?? "");
                                        }}
                                        error={errors?.payments?.[i]?.paymentMethod?.message}
                                        data={listPaymentMethod}
                                        optionDesc="domainvalue"
                                        optionValue="domainvalue"
                                    />
                                </TableCell>
                                <TableCell sx={{ width: 200 }}>
                                    <FieldEdit
                                        fregister={{
                                            ...register(`payments.${i}.amount`, {
                                                validate: (value) => (value > 0) || "Debe ser mayor de 0"
                                            })
                                        }}
                                        type="number"
                                        valueDefault={getValues(`payments.${i}.amount`)}
                                        error={errors.payments?.[i]?.amount?.message}
                                        onChange={(value) => handleChangeValidateAmount(value as string, i)}
                                    />
                                </TableCell>
                                <TableCell style={{ width: 200 }}>
                                    <IconButton
                                        onClick={() => {
                                            setPosition(i);
                                            setOpenDialogEvidence(true);
                                        }}
                                    >
                                        <Avatar
                                            src={getValues(`payments.${i}.evidence`)}
                                        />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <DropZoneDialog
                url={getValues(`payments.${position}.evidence`)}
                onFileUpload={(url) => {
                    setValue(`payments.${position}.evidence`, url);
                    trigger(`payments.${position}.evidence`);
                }}
                title="Subir evidencia"
                openDialog={openDialogEvidence}
                setOpenDialog={setOpenDialogEvidence}
            />
        </>
    )
}