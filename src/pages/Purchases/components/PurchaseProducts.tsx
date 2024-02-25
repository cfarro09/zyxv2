import { Add, Delete } from "@mui/icons-material";
import { Avatar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { IPurchase, ObjectZyx } from "@types";
import FieldEdit from "components/Controls/FieldEdit";
import { FieldSelect } from "components/Controls/FieldSelect";
import React, { useState } from "react";
import { Control, FieldErrors, useFieldArray, useFormContext } from "react-hook-form";
import NewProductDialog from "./NewProductDialog";
import { IProduct } from "pages/Product/models";
import { IDataAux } from "../models";

export const PurchaseProducts: React.FC<{
    control: Control<IPurchase, object, IPurchase>;
    loading: boolean;
    listProduct: ObjectZyx[];
    errors: FieldErrors<IPurchase>;
    disabled?: boolean;
    setDataAux: React.Dispatch<React.SetStateAction<IDataAux>>
}> = ({ control, loading, listProduct, errors, setDataAux, disabled }) => {
    const { setValue, register, getValues, trigger, watch } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'products',
    });
    const [openNewProductDialog, setOpenNewProductDialog] = useState(false)
    const [newProductTitle, setNewProductTitle] = useState('')
    const [newProductIndex, setNewProductIndex] = useState(0)

    const calculateSubtotal = (i: number, price: number, quantity: number) => {
        const total = (price || 0) * (quantity || 0);
        setValue(`products.${i}.total`, total);
        trigger(`products.${i}.total`);
    }

    const handleNewProduct = (product: IProduct, index: number) => {
        if (product) {
            setDataAux((prev: IDataAux) => {
                return {
                    ...prev,
                    listProduct: [
                        ...prev.listProduct,
                        product
                    ]
                } as IDataAux;
            });

            setTimeout(() => {
                setValue(`products.${index}.quantity`, 1);
                setValue(`products.${index}.productid`, product.productid);
                setValue(`products.${index}.productid`, (product?.productid as number) ?? 0);
                setValue(`products.${index}.purchase_price`, (product?.purchase_price as number) ?? 0);
                trigger(`products.${index}.purchase_price`);
                calculateSubtotal(index, getValues(`products.${index}.quantity`), (product?.purchase_price as number) ?? 0);
            }, 100);
        }
    }

    const cleanProducts = React.useCallback((position: number) => {
        const productidSelected = getValues(`products.${position}.productid`);
        const productSelected = getValues("products").map(p => p.productid === productidSelected ? 0 : p.productid);
        return listProduct.filter(p => !productSelected?.includes(p.productid as number));
    }, [watch["products"], listProduct])

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
                                        onClick={() => {
                                            append({
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
                                            })
                                        }}
                                    >
                                        <Add />
                                    </IconButton>
                                }
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
                                    {disabled && `${item.title} - ${item.barcode}`}
                                    {!disabled &&
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
                                                    setValue(`products.${i}.quantity`, 1);
                                                    setValue(`products.${i}.productid`, value.productid);
                                                }
                                                setValue(`products.${i}.productid`, (value?.productid as number) ?? 0);
                                                setValue(`products.${i}.purchase_price`, (value?.purchase_price as number) ?? 0);
                                                trigger(`products.${i}.purchase_price`);
                                                calculateSubtotal(i, getValues(`products.${i}.quantity`), (value?.purchase_price as number) ?? 0);
                                            }}
                                            virtualize={true}
                                            renderOption={(option) => (
                                                <React.Fragment>
                                                    <Avatar alt={`${option.title}`} src={`${option.image}`} sx={{ marginRight: 2 }} />
                                                    {option["title"]}
                                                </React.Fragment>
                                            )}
                                            error={errors?.products?.[i]?.productid?.message}
                                            addOption={true}
                                            addFunction={(value) => {
                                                setNewProductTitle(value as string)
                                                setOpenNewProductDialog(true);
                                                setNewProductIndex(i);
                                            }}
                                            data={cleanProducts(i)}
                                            optionDesc="title"
                                            optionValue="productid"
                                        />
                                    }
                                </TableCell>
                                <TableCell sx={{ width: 200 }}>
                                    <FieldEdit
                                        disabled={disabled}
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
                                            if (quantity < 0) {
                                                setValue(`products.${i}.quantity`, 0);
                                                trigger(`products.${i}.quantity`);
                                                return 0;
                                            }
                                            setValue(`products.${i}.quantity`, quantity);
                                            trigger(`products.${i}.quantity`);
                                            calculateSubtotal(i, price, quantity);
                                        }}
                                    />
                                </TableCell>
                                <TableCell style={{ width: 200 }}>
                                    <FieldEdit
                                        disabled={disabled}
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
                                            if (price < 0) {
                                                setValue(`products.${i}.purchase_price`, 0);
                                                trigger(`products.${i}.purchase_price`);
                                                return 0;
                                            }
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
                newProductTitle={newProductTitle}
                handleNewProduct={handleNewProduct}
                productIndex={newProductIndex}
            />
        </>

    )
}