/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { a11yProps, getProductSel, getPurchaseOrder, getValuesFromDomain, purchaseOrderIns, purchaseOrderLineIns, purchaseOrderPaymentIns } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { FormProvider, useForm } from 'react-hook-form';
import { IMainProps, IPurchase } from '@types';
import SaveIcon from '@mui/icons-material/Save';
import { useSendFormApi } from 'hooks/useSendFormApi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useMultiData } from 'hooks/useMultiData';
import { PurchaseProducts } from './PurchaseProducts';
import { PurchasePayments } from './PurchasePayments';
import TabPanel from 'components/Layout/TabPanel';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'stores/popus/actions';
import { IDataAux } from '../models';

export const ManagePurchase: React.FC<IMainProps> = ({ baseUrl }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [tab, settab] = React.useState(0);

    const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => settab(newValue);

    const { id } = useParams<{ id?: string }>();
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], listProduct: [], listPaymentMethod: [], listSupplier: [], listWarehouse: [] });
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => navigate(baseUrl),
    });
    const methods = useForm<IPurchase>({
        defaultValues: {
            purchaseorderid: 0,
            supplier: '',
            order_date: dayjs().format('YYYY-MM-DD'),
            status: 'ACTIVO',
            total_amount: 0,
            sub_total: 0,
            products: [],
            payments: []
        },
    });
    const { control, register, handleSubmit, setValue, getValues, reset, formState: { errors }, watch } = methods;


    React.useEffect(() => {
        const subtotal = getValues('products').reduce((acc, item) => acc + item.total, 0);
        setValue("total_amount", subtotal);
        setValue("sub_total", subtotal);
    }, [watch(["products"])])

    const { giveMeData, loading } = useMultiData<IPurchase, IDataAux>({
        registerX: () => {
            register('purchaseorderid');
            register('status');
            register('warehouse', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('supplier', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('order_date', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        },
        reset,
        setDataAux,
        collections: [
            ...(id !== 'new' ? [{
                rb: getPurchaseOrder(parseInt(`${id}`)),
                key: 'UFN_PURCHASE_ORDER_SEL',
                keyData: "",
                main: true,
            }] : []),
            { rb: getValuesFromDomain('ESTADO'), key: 'UFN_DOMAIN_VALUES_SEL-ESTADO', keyData: "listStatus" },
            { rb: getValuesFromDomain('PROVEEDOR'), key: 'UFN_DOMAIN_VALUES_SEL-PROVEEDOR', keyData: "listSupplier" },
            { rb: getValuesFromDomain('METODOPAGO'), key: 'UFN_DOMAIN_VALUES_SEL-METODOPAGO', keyData: "listPaymentMethod" },
            { rb: getValuesFromDomain('ALMACEN'), key: 'UFN_DOMAIN_VALUES_SEL-ALMACEN', keyData: "listWarehouse" },
            { rb: getProductSel(0, true), key: 'UFN_PRODUCT_SEL', keyData: "listProduct" },
        ],
    });

    useEffect(() => {
        giveMeData();
    }, []);

    const onSubmit = handleSubmit((data) => {
        const totalProducts = data.products.reduce((acc, item) => acc + item.total, 0);
        const totalPayments = data.payments.reduce((acc, item) => acc + item.payment_amount, 0);
        if (totalProducts === 0) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: `Debes ingresar al menos un producto` }));
            return;
        }
        if (totalProducts.toFixed(2) !== totalPayments.toFixed(2)) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: `La diferencia a pagar es diferente al total de productos.` }));
            return;
        }
        onSubmitData({
            header: purchaseOrderIns({
                ...data,
                operation: data.purchaseorderid > 0 ? "UPDATE" : "INSERT",
                total_amount: totalProducts,
                sub_total: totalProducts
            }),
            detail: [
                ...data.products.map(product => purchaseOrderLineIns({ ...product, operation: product.purchaseorderlineid > 0 ? "UPDATE" : "INSERT" })),
                ...data.payments.map(payment => purchaseOrderPaymentIns({ ...payment, operation: payment.purchaseorderpaymentid > 0 ? "UPDATE" : "INSERT" })),
            ]
        }, true)
    });

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <div className="my-3">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color='textPrimary' to={baseUrl}>
                        <Typography color="secondary" fontWeight={500}>Ordenes de compra</Typography>
                    </Link>
                    <Typography color="textSecondary">Detalle</Typography>
                </Breadcrumbs>
            </div>
            <FormProvider {...methods}>
                <Paper className="w-full mt-6" component={'form'} onSubmit={onSubmit} sx={{ marginTop: 0 }}>
                    <Grid container className="px-6 py-3 border-b">
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="h5">
                                    {id === 'new' ? 'Nueva Orden de Compra' : `Orden de Compra ${getValues('order_number')}`}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} container justifyContent={'flex-end'} gap={2}>
                            <Button
                                color='primary'
                                type='submit'
                                startIcon={<SaveIcon />}
                                disabled={loading}
                                variant="contained">Guardar
                            </Button>
                        </Grid>
                    </Grid>

                    <Box className="p-6  border-b">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <FieldSelect
                                    label={'Proveedor'}
                                    variant="outlined"
                                    valueDefault={getValues('supplier')}
                                    onChange={(value) => setValue('supplier', value?.domainvalue as string ?? "")}
                                    error={errors?.supplier?.message}
                                    loading={loading}
                                    data={dataAux.listSupplier}
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldSelect
                                    label={'Almacén'}
                                    variant="outlined"
                                    valueDefault={getValues('warehouse')}
                                    onChange={(value) => setValue('warehouse', value?.domainvalue as string ?? "")}
                                    error={errors?.warehouse?.message}
                                    loading={loading}
                                    data={dataAux.listWarehouse}
                                    optionDesc="domainvalue"
                                    optionValue="domainvalue"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldEdit
                                    label={'Fecha'}
                                    type="date"
                                    valueDefault={getValues('order_date')?.split(" ")[0]}
                                    onChange={(value) => setValue('order_date', `${value}`)}
                                    error={errors.order_date?.message}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className="px-6" sx={{ width: '100%' }}>
                        <Box sx={{ width: '100%', }}>
                            <Tabs
                                value={tab}
                                onChange={handleChangeTab}
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Productos" {...a11yProps(0)} />
                                <Tab
                                    label="Pagos" {...a11yProps(1)}
                                    disabled={getValues('total_amount') === 0}
                                />
                            </Tabs>
                        </Box>
                    </Box>
                    <Box>
                        <TabPanel value={tab} index={0}>
                            <PurchaseProducts
                                control={control}
                                loading={loading}
                                setDataAux={setDataAux}
                                listProduct={dataAux.listProduct}
                                errors={errors}
                            />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <PurchasePayments
                                control={control}
                                loading={loading}
                                listPaymentMethod={dataAux.listPaymentMethod}
                                errors={errors}
                            />
                        </TabPanel>
                    </Box>
                    <Box className="p-6 pt-0">
                        <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
                            Total a pagar S/ {(getValues('products').reduce((acc, item) => acc + item.total, 0)).toFixed(2)}
                        </Typography>
                    </Box>
                </Paper >
            </FormProvider>
        </Box >
    );
};

export default ManagePurchase;