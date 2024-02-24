import { Add, Delete } from "@mui/icons-material";
import { Avatar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ISale, ObjectZyx } from "@types";
import FieldEdit from "components/Controls/FieldEdit";
import { FieldSelect } from "components/Controls/FieldSelect";
import React from "react";
import { Control, FieldErrors, useFieldArray, useFormContext } from "react-hook-form";

export const SaleProducts: React.FC<{
    control: Control<ISale, object, ISale>;
    loading: boolean;
    listProduct: ObjectZyx[];
    errors: FieldErrors<ISale>;
    disabled?: boolean;
}> = ({ control, loading, listProduct, errors, disabled }) => {

    const { setValue, register, getValues, trigger } = useFormContext()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'products',
    });

    const calculateSubtotal = (i: number, price: number, quantity: number) => {
        const total = (price || 0) * (quantity || 0);
        setValue(`products.${i}.total`, total);
        trigger(`products.${i}.total`);
    }

    return (
        <div>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                {!disabled &&
                                    <IconButton
                                        size="small"
                                        disabled={loading}
                                        onClick={() => append({
                                            saleorderlineid: 0,
                                            productid: 0,
                                            inventoryid: 0,
                                            barcode: '',
                                            code: '',
                                            description: '',
                                            image: '',
                                            status: 'ACTIVO',
                                            quantity: 1,
                                            selling_price: 0,
                                            total: 0
                                        })}
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
                                            disabled={disabled}
                                            variant='outlined'
                                            onChange={(value) => {
                                                setValue(`products.${i}.productid`, (value?.productid as number) ?? 0);
                                                setValue(`products.${i}.title`, (value?.title) ?? "");
                                                setValue(`products.${i}.stock`, (value?.stock as number) ?? 0);
                                                setValue(`products.${i}.inventoryid`, (value?.inventoryid as number) ?? 0);
                                                setValue(`products.${i}.selling_price`, (value?.selling_price as number) ?? 0);
                                                trigger(`products.${i}.selling_price`);
                                                trigger(`products.${i}.stock`);
                                                calculateSubtotal(i, getValues(`products.${i}.quantity`), (value?.selling_price as number) ?? 0);
                                            }}
                                            renderOption={(option) => (
                                                <React.Fragment>
                                                    <Avatar alt={`${option.description}`} src={`${option.image}`} sx={{ marginRight: 2 }} />
                                                    {option["description"]}
                                                </React.Fragment>
                                            )}
                                            error={errors?.products?.[i]?.productid?.message}
                                            data={listProduct}
                                            optionDesc="description"
                                            optionValue="productid"
                                        />
                                    }
                                </TableCell>
                                <TableCell sx={{ width: 200 }}>
                                    <FieldEdit
                                        disabled={disabled}
                                        fregister={{
                                            ...register(`products.${i}.quantity`, {
                                                validate: (value) => (value > 0) ? (value <= getValues(`products.${i}.stock`) || `La cantidad debe ser menor a la del stock: ${getValues(`products.${i}.stock`)}`) : "Debe ser mayor de 0"
                                            }),
                                        }}
                                        type="number"
                                        valueDefault={getValues(`products.${i}.quantity`)}
                                        error={errors.products?.[0]?.quantity?.message}
                                        onChange={(value) => {
                                            const quantity = parseInt(value || "0");
                                            const stock = getValues(`products.${i}.stock`) || 0;
                                            if (quantity < 0 || stock < quantity) {
                                                setValue(`products.${i}.quantity`, quantity < 0 ? 0 : stock);
                                                trigger(`products.${i}.quantity`);
                                                return 0;
                                            }
                                            const price = getValues(`products.${i}.selling_price`) || 0;
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
                                            ...register(`products.${i}.selling_price`, {
                                                validate: (value) => (value > 0) || "Debe ser mayor de 0"
                                            })
                                        }}
                                        type="number"
                                        valueDefault={getValues(`products.${i}.selling_price`)}
                                        error={errors?.products?.[i]?.selling_price?.message}
                                        onChange={(value) => {
                                            const quantity = getValues(`products.${i}.quantity`) || 0;
                                            const price = parseFloat(value || "0.0");
                                            if (price < 0) {
                                                setValue(`products.${i}.selling_price`, 0);
                                                trigger(`products.${i}.selling_price`);
                                                return 0;
                                            }
                                            setValue(`products.${i}.selling_price`, price);
                                            trigger(`products.${i}.selling_price`);
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
        </div>
    )
}