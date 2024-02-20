import { Add, Delete } from "@mui/icons-material";
import { Avatar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ObjectZyx, IPayment, IPurchase, IProductZyx } from "@types";
import DropZoneDialog from "components/Controls/DropZoneDialog";
import FieldEdit from "components/Controls/FieldEdit";
import { FieldSelect } from "components/Controls/FieldSelect";
import React, { useState } from "react";
import { Control, FieldErrors, useFieldArray, useFormContext } from "react-hook-form";

export const PurchasePayments: React.FC<{
    control: Control<IPurchase, object, IPurchase>;
    loading: boolean;
    listPaymentMethod: ObjectZyx[];
    errors: FieldErrors<IPurchase>
}> = ({ control, loading, listPaymentMethod, errors }) => {
    const [openDialogEvidence, setOpenDialogEvidence] = useState(false);
    const { setValue, register, getValues, trigger } = useFormContext();
    const [position, setPosition] = useState<number>(0)
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'payments',
    });

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
                                    onClick={async () => append({ paymentid: 0, paymentMethod: '', evidence: '', amount: getValues('products').reduce((acc: number, item: IProductZyx) => acc + item.subtotal, 0) })}
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
                                                validate: (value) => (value > 0) || "El campo es requerido"
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
                                            }),
                                        }}
                                        type="number"
                                        valueDefault={getValues(`payments.${i}.amount`)}
                                        error={errors.payments?.[0]?.amount?.message}
                                        onChange={(value) => {
                                            setValue(`payments.${i}.amount`, parseFloat(value || "0.0"));
                                        }}
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