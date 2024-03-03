import React, { useEffect, useState } from "react";
import { Add, Delete } from "@mui/icons-material";
import { Avatar, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ISale, ObjectZyx } from "@types";
import FieldEdit from "components/Controls/FieldEdit";
import { FieldSelect } from "components/Controls/FieldSelect";
import { Control, FieldErrors, useFieldArray, useFormContext } from "react-hook-form";
import { useDispatch } from "react-redux";
import { showSnackbar } from "stores/popus/actions";

const regexOnlyNumber = /^\d+$/;


export const SaleProducts: React.FC<{
    control: Control<ISale, object, ISale>;
    loading: boolean;
    listProduct: ObjectZyx[];
    errors: FieldErrors<ISale>;
    disabled?: boolean;
}> = ({ control, loading, listProduct, errors, disabled }) => {
    const dispatch = useDispatch();
    const [barcode, setBarcode] = useState('');
    const { setValue, register, getValues, trigger, watch } = useFormContext<ISale>()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'products',
    });

    const calculateSubtotal = (i: number, price: number, quantity: number, goTrigger: boolean = true) => {
        const total = (price || 0) * (quantity || 0);
        setValue(`products.${i}.total`, total);
        if (goTrigger) {
            trigger(`products.${i}.total`);
        }
    }

    const newFieldBlank = () => append({
        saleorderlineid: 0,
        productid: 0,
        inventoryid: 0,
        barcode: '',
        code: '',
        description: '',
        image: '',
        status: 'ACTIVO',
        quantity: 0,
        selling_price: 0,
        total: 0
    });

    useEffect(() => {
        newFieldBlank();
    }, []);

    const insertProductFromReader = (barcode: string) => {
        const products = cleanProducts(-1);
        const productFound = products.find(product => `${product.barcode}`.includes(barcode));
        if (!productFound) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: `El producto leido no existe.` }));
            return;
        }
        append({
            saleorderlineid: 0,
            productid: productFound.productid as number,
            inventoryid: productFound.inventoryid as number,
            barcode: productFound.barcode as string,
            code: productFound.code as string,
            description: productFound.description as string,
            image: productFound.image as string,
            status: 'ACTIVO',
            quantity: 1,
            stock: productFound.stock as number,
            selling_price: productFound.selling_price as number,
            total: 0
        });
        setTimeout(() => {
            const position = fields.length;
            calculateSubtotal(position, getValues(`products.${position}.quantity`), (productFound.selling_price as number) ?? 0, false);
            trigger([`products.${position}.selling_price`, `products.${position}.productid`, `products.${position}.stock`, `products.${position}.total`]);
            document?.activeElement?.blur();
        }, 200);
    }

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key !== 'Enter') {
                e.stopPropagation();
                setBarcode(regexOnlyNumber.test(barcode + e.key) ? barcode + e.key : '');
                return;
            } else if (barcode !== '') {
                if (barcode.length >= 6) {
                    insertProductFromReader(barcode);
                }
                // Resetea el código de barras para la próxima lectura
                setBarcode('');
                return;
            }
        };

        window.addEventListener('keypress', handleKeyPress);

        return () => {
            window.removeEventListener('keypress', handleKeyPress);
        };
    }, [barcode]);


    const cleanProducts = React.useCallback((position: number) => {
        const productidSelected = getValues(`products.${position}.productid`);
        const productSelected = getValues("products").map(p => p.productid === productidSelected ? 0 : p.productid);
        return listProduct.filter(p => !productSelected?.includes(p.productid as number));
    }, [watch("products"), listProduct])

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
                                        onClick={newFieldBlank}
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
                                                    // validate: (value) => (value > 0) || "El campo es requerido"
                                                })
                                            }}
                                            virtualize={true}
                                            disabled={disabled}
                                            variant='outlined'
                                            onChange={(value) => {
                                                setValue(`products.${i}.productid`, (value?.productid as number) ?? 0);
                                                setValue(`products.${i}.quantity`, 1);
                                                setValue(`products.${i}.title`, (value?.title as string) ?? "");
                                                setValue(`products.${i}.stock`, (value?.stock as number) ?? 0);
                                                setValue(`products.${i}.inventoryid`, (value?.inventoryid as number) ?? 0);
                                                setValue(`products.${i}.selling_price`, (value?.selling_price as number) ?? 0);
                                                calculateSubtotal(i, getValues(`products.${i}.quantity`), (value?.selling_price as number) ?? 0, false);
                                                trigger([`products.${i}.productid`, `products.${i}.selling_price`, `products.${i}.stock`, `products.${i}.quantity`, `products.${i}.total`]);
                                                newFieldBlank();
                                            }}
                                            renderOption={(option) => (
                                                <React.Fragment>
                                                    <Avatar alt={`${option.description}`} src={`${option.image}`} sx={{ marginRight: 2 }} />
                                                    {option["description"]}
                                                </React.Fragment>
                                            )}
                                            error={errors?.products?.[i]?.productid?.message}
                                            data={cleanProducts(i)}
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
                                                validate: (value) => getValues(`products.${i}.productid`) === 0 || ((value > 0) ? (value <= getValues(`products.${i}.stock`)! || `La cantidad debe ser menor a la del stock: ${getValues(`products.${i}.stock`)}`) : "Debe ser mayor de 0")
                                            }),
                                        }}
                                        type="number"
                                        valueDefault={getValues(`products.${i}.quantity`)}
                                        error={errors.products?.[i]?.quantity?.message}
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
                                            calculateSubtotal(i, price, quantity, false);
                                            trigger([`products.${i}.quantity`, `products.${i}.total`]);
                                        }}
                                    />
                                </TableCell>
                                <TableCell style={{ width: 200 }}>
                                    <FieldEdit
                                        disabled={true}
                                        fregister={{
                                            ...register(`products.${i}.selling_price`, {
                                                validate: (value) => (getValues(`products.${i}.productid`) === 0 || value! > 0) || "Debe ser mayor de 0"
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
                                            calculateSubtotal(i, price, quantity, false);
                                            trigger([`products.${i}.selling_price`, `products.${i}.total`]);
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