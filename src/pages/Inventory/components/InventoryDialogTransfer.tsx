import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import type { ModalProps } from '@mui/material';
import React, { useEffect } from "react";
import { InventoryDialogTransferProps, TransferProps } from "../models";
import { useSendFormApi } from "hooks/useSendFormApi";
import { useFieldArray, useForm } from "react-hook-form";
import { FieldSelect } from "components/Controls/FieldSelect";
import FieldEdit from "components/Controls/FieldEdit";
import { transferInventory } from "common/helpers";



const InventoryDialogTransfer: React.FC<InventoryDialogTransferProps> = ({ open, setOpenDialog, listWarehouse, products, warehouseSelected, fetchData }) => {
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => {
            setOpenDialog(false);
            fetchData && fetchData();
        },
    });

    const { control, register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<TransferProps>({
        defaultValues: {
            warehouse: '',
            products: []
        },
    });

    const { fields } = useFieldArray({
        control,
        name: 'products',
    });

    useEffect(() => {
        if (open) {
            reset({
                warehouse: "",
                products
            })
            register('warehouse', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        }
    }, [open])


    const handleCancelModal: ModalProps['onClose'] = (_, reason) => {
        if (reason !== 'backdropClick') {
            setOpenDialog(false);
        }
    }

    const onSubmitDomain = handleSubmit((data) => {
        onSubmitData({
            header: null,
            detail: data.products.map(x => transferInventory(x.inventoryid, data.warehouse, x.quantity))
        }, true);
    });


    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            onClose={handleCancelModal}
            PaperProps={{
                component: 'form',
                onSubmit: onSubmitDomain,
            }}
        >
            <DialogTitle>
                {"Transferir productos entre almacenes"}
            </DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item xs={12} sm={6} paddingTop={1}>
                        <FieldSelect
                            label={'Almacén'}
                            variant="outlined"
                            valueDefault={getValues('warehouse')}
                            onChange={(value) => setValue('warehouse', value?.domainvalue as string ?? "")}
                            error={errors?.warehouse?.message}
                            data={listWarehouse.filter(x => x.domainvalue !== warehouseSelected)}
                            optionDesc="domainvalue"
                            optionValue="domainvalue"
                        />
                    </Grid>
                </Grid>
                <TableContainer sx={{ paddingTop: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>{"Producto"}</TableCell>
                                <TableCell>{"Cantidad"}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody style={{ marginTop: 5 }}>
                            {fields.map((item, i: number) =>
                                <TableRow key={item.id}>
                                    <TableCell>
                                        {`${getValues(`products.${i}.title`)} (${getValues(`products.${i}.stock`)})`}
                                    </TableCell>
                                    <TableCell style={{ width: 200 }}>
                                        <FieldEdit
                                            fregister={{
                                                ...register(`products.${i}.quantity`, {
                                                    validate: (value) => (value > 0) ? (value <= getValues(`products.${i}.stock`) || `La cantidad debe ser menor a la del stock: ${getValues(`products.${i}.stock`)}`) : "Debe ser mayor de 0"
                                                }),
                                            }}
                                            type="number"
                                            valueDefault={getValues(`products.${i}.quantity`)}
                                            error={errors?.products?.[i]?.quantity?.message}
                                            onChange={(value) => {
                                                const quantity = parseInt(value || "0");
                                                setValue(`products.${i}.quantity`, quantity);
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
                <Button color="secondary" type="submit">Guardar</Button>
            </DialogActions>
        </Dialog >
    );
};

export default InventoryDialogTransfer;
