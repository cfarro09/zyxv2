import { Add, Delete } from "@mui/icons-material";
import { Avatar, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IPurchase, ObjectZyx } from "@types";
import FieldEdit from "components/Controls/FieldEdit";
import { FieldSelect } from "components/Controls/FieldSelect";
import React, { useState } from "react";
import { Control, FieldErrors, useFieldArray, useFormContext } from "react-hook-form";
import NewProductDialog from "./NewProductDialog";

export const PurchaseProducts: React.FC<{
    control: Control<IPurchase, object, IPurchase>;
    loading: boolean;
    listProduct: ObjectZyx[];
    errors: FieldErrors<IPurchase>
}> = ({ control, loading, listProduct, errors }) => {
    const { setValue, register, getValues, trigger } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'products',
    });
    const [openNewProductDialog, setOpenNewProductDialog] = useState(false)
    const [newProductTitle, setNewProductTitle] = useState('')

    const calculateSubtotal = (i: number, price: number, quantity: number) => {
        const total = (price || 0) * (quantity || 0);
        setValue(`products.${i}.total`, total);
        trigger(`products.${i}.total`);
    }

    const handleNewProduct = (value: object, index: number) => {
        if (value) {
            // setValue(`products.${i}`, value);
            setValue(`products.${index}.quantity`, 1);
            setValue(`products.${index}.productid`, value.productid);
        }
        setValue(`products.${index}.productid`, (value?.productid as number) ?? 0);
        setValue(`products.${index}.purchase_price`, (value?.purchase_price as number) ?? 0);
        trigger(`products.${index}.purchase_price`);
        calculateSubtotal(index, getValues(`products.${index}.quantity`), (value?.purchase_price as number) ?? 0); 
    }

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
                                    onClick={() => append({
                                        purchaseorderlineid: 0,
                                        productid: 0,
                                        barcode: '',
                                        code: '',
                                        description: '',
                                        image: '',
                                        status: 'ACTIVO',
                                        quantity: 1,
                                        purchase_price: 0,
                                        total: 0
                                    })}
                                >
                                    <Add />
                                </IconButton>
                            </TableCell>
                            <TableCell>{"Producto"}</TableCell>
                            <TableCell>{"Cantidad"}</TableCell>
                            <TableCell>{"Precio"}</TableCell>
                            <TableCell>{"Subtotal"}</TableCell>
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
                                        label={"Product"}
                                        valueDefault={getValues(`products.${i}.productid`)}
                                        fregister={{
                                            ...register(`products.${i}.productid`, {
                                                validate: (value) => (value > 0) || "El campo es requerido"
                                            })
                                        }}
                                        variant='outlined'
                                        onChange={(value) => {
                                            if (value) {
                                                // setValue(`products.${i}`, value);
                                                setValue(`products.${i}.quantity`, 1);
                                                setValue(`products.${i}.productid`, value.productid);
                                            }
                                            setValue(`products.${i}.productid`, (value?.productid as number) ?? 0);
                                            setValue(`products.${i}.purchase_price`, (value?.purchase_price as number) ?? 0);
                                            trigger(`products.${i}.purchase_price`);
                                            calculateSubtotal(i, getValues(`products.${i}.quantity`), (value?.purchase_price as number) ?? 0);
                                        }}
                                        renderOption={(option) => (
                                            <React.Fragment>
                                                <Avatar alt={`${option.description}`} src={`${option.image}`} sx={{ marginRight: 2 }} />
                                                {option["description"]}
                                            </React.Fragment>
                                        )}
                                        error={errors?.products?.[i]?.productid?.message}
                                        addOption={true}
                                        addFunction={(value) => {
                                            setNewProductTitle(value as string)
                                            setOpenNewProductDialog(true);
                                            console.log({ value });
                                        }}
                                        data={listProduct}
                                        optionDesc="description"
                                        optionValue="productid"
                                    />
                                </TableCell>
                                <TableCell sx={{ width: 200 }}>
                                    <FieldEdit
                                        fregister={{
                                            ...register(`products.${i}.quantity`, {
                                                validate: (value) => (value > 0) || "Debe ser mayor de 0"
                                            }),
                                        }}
                                        type="number"
                                        valueDefault={getValues(`products.${i}.quantity`)}
                                        error={errors.products?.[0]?.quantity?.message}
                                        onChange={(value) => {
                                            const quantity = parseInt(value || "0");
                                            const price = getValues(`products.${i}.purchase_price`) || 0;
                                            setValue(`products.${i}.quantity`, quantity);
                                            trigger(`products.${i}.quantity`);
                                            calculateSubtotal(i, price, quantity);
                                        }}
                                    />
                                </TableCell>
                                <TableCell style={{ width: 200 }}>
                                    <FieldEdit
                                        fregister={{
                                            ...register(`products.${i}.purchase_price`, {
                                                validate: (value) => (value > 0) || "Debe ser mayor de 0"
                                            }),
                                        }}
                                        type="number"
                                        valueDefault={getValues(`products.${i}.purchase_price`)}
                                        error={errors?.products?.[i]?.purchase_price?.message}
                                        onChange={(value) => {
                                            const quantity = getValues(`products.${i}.quantity`) || 0;
                                            const price = parseFloat(value || "0.0");
                                            setValue(`products.${i}.purchase_price`, price);
                                            trigger(`products.${i}.purchase_price`);
                                            calculateSubtotal(i, price, quantity)
                                        }}
                                    />
                                </TableCell>
                                <TableCell sx={{ width: 150, textAlign: 'right' }}>
                                    {(getValues(`products.${i}.total`) || 0 as number).toFixed(2)}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <NewProductDialog
                open={openNewProductDialog}
                setOpenDialog={setOpenNewProductDialog}
                setValue={setValue}
                newProductTitle={newProductTitle}
            />
        </>

    )
}