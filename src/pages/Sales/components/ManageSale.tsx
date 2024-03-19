/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Button, Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material';
import { a11yProps, getCustomerSel, getValuesFromDomain, getSaleOrder, saleOrderIns, saleOrderLineIns, saleOrderPaymentIns, getStockSel } from 'common/helpers';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { IMainProps, ISale, ObjectZyx } from '@types';
import SaveIcon from '@mui/icons-material/Save';
import { useSendFormApi } from 'hooks/useSendFormApi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useMultiData } from 'hooks/useMultiData';
import { SaleProducts } from './SaleProducts';
import { SalePayments } from './SalePayments';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { showSnackbar } from 'stores/popus/actions';
import TabPanel from 'components/Layout/TabPanel';
import HelpChangePayment from './HelpChangePayment';
import AddCustomer from './AddCustomer';
import axios from 'axios';

interface IDataAux {
    listStatus: ObjectZyx[];
    listProduct: ObjectZyx[];
    listPaymentMethod: ObjectZyx[];
    listCustomer: ObjectZyx[];
}

const fetchPrint = async (sale: ISale) => {
    try {
        const response = await axios.post('http://localhost:7065/api/drawpdf', sale, {
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer apis-token-7495.Up1n8BkaSNJc-6yGe2hUo9Ez6032xzHl'
            }
        });
        return response.data;
    } catch (error) {
        return null
    }
};

export const ManageSale: React.FC<IMainProps> = ({ baseUrl }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [openAddCustomerDialog, setOpenAddCustomerDialog] = useState(false);
    const [tab, settab] = React.useState(0);

    const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => settab(newValue);

    const { id } = useParams<{ id?: string }>();
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], listProduct: [], listPaymentMethod: [], listCustomer: [] });
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: (data) => {
            const sale = getValues()
            sale.products = sale.products.filter(x => x.productid > 0);

            sale.order_number = ((data as ObjectZyx)?.vordernumber as string || "") as string;
            sale.cashier = ((data as ObjectZyx)?.vcashier || "") as string;
            fetchPrint(sale);
            navigate(baseUrl + window.location.search);
        },
    });
    const methods = useForm<ISale>({
        defaultValues: {
            saleorderid: 0,
            customerid: 2,
            customerdesc: "CLIENTE",
            order_date: dayjs().format('YYYY-MM-DD'),
            status: 'ACTIVO',
            total_amount: 0,
            billing: false,
            sub_total: 0,
            products: [],
            payments: []
        },
    });

    const { control, register, handleSubmit, setValue, getValues, reset, formState: { errors }, trigger, watch } = methods;

    const watches = useWatch({
        control,
        name: ["products", "billing"],
    });

    React.useEffect(() => {
        const subtotal = getValues('products').reduce((acc, item) => acc + item.total, 0);
        const total = subtotal * (getValues('billing') ? 1.18 : 1);
        setValue("total_amount", total);
        setValue("sub_total", subtotal);
    }, [watches])

    const { giveMeData, loading } = useMultiData<ISale, IDataAux>({
        registerX: () => {
            register('saleorderid');
            register('status');
            register('moneyFromCustomer');
            register('customerdesc');
            register('total_amount');
            register('sub_total');
            register('customerid', { validate: (value) => Boolean(value > 0) || 'El campo es requerido' });
            register('order_date', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        },
        reset,
        setDataAux,
        collections: [
            ...(id !== 'new' ? [{
                rb: getSaleOrder(parseInt(`${id}`)),
                key: 'UFN_SALE_ORDER_SEL',
                keyData: "",
                main: true,
            }] : []),
            { rb: getValuesFromDomain('ESTADO'), key: 'UFN_DOMAIN_VALUES_SEL-ESTADO', keyData: "listStatus" },
            { rb: getValuesFromDomain('METODOPAGO'), key: 'UFN_DOMAIN_VALUES_SEL-METODOPAGO', keyData: "listPaymentMethod" },
            { rb: getStockSel(), key: 'UFN_STOCK_SEL', keyData: "listProduct" },
            { rb: getCustomerSel(0), key: 'UFN_CLIENT_SEL', keyData: "listCustomer" },
        ],
    });

    useEffect(() => {
        giveMeData();
    }, []);

    const onSubmit = handleSubmit((data) => {
        const products = data.products.filter(x => x.productid > 0);
        const totalProducts = products.reduce((acc, item) => acc + item.total, 0);
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
            header: saleOrderIns({
                ...data,
                operation: data.saleorderid > 0 ? "UPDATE" : "INSERT",
                total_amount: totalProducts,
                sub_total: totalProducts
            }),
            detail: [
                ...products.map(product => saleOrderLineIns({ ...product, operation: product.saleorderlineid > 0 ? "UPDATE" : "INSERT" })),
                ...data.payments.map(payment => saleOrderPaymentIns({ ...payment, operation: payment.saleorderpaymentid > 0 ? "UPDATE" : "INSERT" })),
            ]
        }, true)
    });

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to={baseUrl + window.location.search}>
                            <Typography color="secondary" fontWeight={500}>Ventas</Typography>
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
                                        {id === 'new' ? 'Nueva Venta' : `Venta ${getValues('order_number')}`}
                                    </Typography>
                                </Box>
                            </Grid>
                            {getValues('saleorderid') === 0 &&
                                <Grid item xs={12} sm={6} container justifyContent={'flex-end'} gap={2}>
                                    <Button
                                        color='primary'
                                        type='submit'
                                        startIcon={<SaveIcon />}
                                        disabled={loading}
                                        variant="contained">Guardar
                                    </Button>
                                </Grid>
                            }
                        </Grid>

                        <Box className="p-6  border-b">
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <FieldSelect
                                        label={'Cliente'}
                                        variant="outlined"
                                        valueDefault={getValues('customerid')}
                                        onChange={(value) => {
                                            setValue('customerid', value?.clientid as number ?? 0)
                                            setValue('customerdesc', value?.name as string ?? "")
                                        }}
                                        error={errors?.customerid?.message}
                                        loading={loading}
                                        disabled={getValues('saleorderid') > 0}
                                        data={dataAux.listCustomer}
                                        optionDesc="name"
                                        optionValue="clientid"
                                        addOption={true}
                                        addFunction={() => setOpenAddCustomerDialog(true)}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FieldEdit
                                        label={'Fecha'}
                                        type="date"
                                        disabled={getValues('saleorderid') > 0}
                                        valueDefault={getValues('order_date')?.split(" ")[0]}
                                        onChange={(value) => setValue('order_date', `${value}`)}
                                        error={errors.order_date?.message}
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4} textAlign={"right"}>
                                    <FormControlLabel
                                        label="¿Factura?"
                                        control={<Checkbox
                                            checked={getValues('billing')}
                                            onChange={(value) => {
                                                setValue('billing', value.target.checked)
                                                trigger('billing')
                                            }}
                                        />}
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
                            <TabPanel value={tab} index={0}  >
                                <SaleProducts
                                    control={control}
                                    loading={loading}
                                    disabled={getValues('saleorderid') > 0}
                                    listProduct={dataAux.listProduct}
                                    errors={errors}
                                />
                            </TabPanel>
                            <TabPanel value={tab} index={1}>
                                <SalePayments
                                    control={control}
                                    loading={loading}
                                    disabled={getValues('saleorderid') > 0}
                                    listPaymentMethod={dataAux.listPaymentMethod}
                                    errors={errors}
                                />
                            </TabPanel>
                        </Box>
                        <Box className="p-6 pt-0">
                            <Grid container>
                                <Grid item xs={6} sm={6}>
                                    {getValues('saleorderid') === 0 &&
                                        <HelpChangePayment
                                            toPay={getValues('total_amount')}
                                        />
                                    }
                                </Grid>
                                <Grid item xs={6} sm={6}>
                                    <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
                                        Total: {getValues('total_amount').toFixed(2)}
                                    </Typography>
                                    <Typography sx={{ fontWeight: "bold", textAlign: "right" }}>
                                        Subtotal: {getValues('sub_total').toFixed(2)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper >
                </FormProvider>
            </Box >
            <AddCustomer
                open={openAddCustomerDialog}
                setOpenDialog={setOpenAddCustomerDialog}
                fetchData={() => {
                    giveMeData(["UFN_CLIENT_SEL"])
                }}
            />
        </>
    );
};

export default ManageSale;