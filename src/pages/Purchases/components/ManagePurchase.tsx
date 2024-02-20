/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { a11yProps, customerIns, getProductSel, getValuesFromDomain } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { FormProvider, useForm } from 'react-hook-form';
import { IMainProps, IPurchase, ObjectZyx } from '@types';
import SaveIcon from '@mui/icons-material/Save';
import { useSendFormApi } from 'hooks/useSendFormApi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useMultiData } from 'hooks/useMultiData';
import { PurchaseProducts } from './PurchaseProducts';
import { PurchasePayments } from './PurchasePayments';
import TabPanel from 'components/Layout/TabPanel';
import dayjs from 'dayjs';

interface IDataAux {
    listStatus: ObjectZyx[];
    listSupplier: ObjectZyx[];
    listProduct: ObjectZyx[];
    listPaymentMethod: ObjectZyx[];
}

export const ManagePurchase: React.FC<IMainProps> = ({ baseUrl }) => {
    const navigate = useNavigate();
    const [tab, settab] = React.useState(0);

    const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => settab(newValue);

    const { id } = useParams<{ id?: string }>();
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], listProduct: [], listPaymentMethod: [], listSupplier: [] });
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => navigate(baseUrl),
    });
    const methods = useForm<IPurchase>({
        defaultValues: {
            purchaseorderid: 0,
            supplier: '',
            date: dayjs().format('YYYY-MM-DD'),
            status: 'ACTIVO',
            products: [],
            payments: []
        },
    });
    const { control, register, handleSubmit, setValue, getValues, reset, formState: { errors } } = methods;

    const { giveMeData, loading } = useMultiData<IPurchase, IDataAux>({
        registerX: () => {
            register('purchaseorderid');
            register('status');
            register('supplier', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('date', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        },
        reset,
        setDataAux,
        collections: [
            // ...(id !== 'new' ? [{
            //     rb: getCustomerSel(parseInt(`${id}`)),
            //     key: 'UFN_CLIENT_SEL',
            //     keyData: "",
            //     main: true,
            // }] : []),
            { rb: getValuesFromDomain('ESTADO'), key: 'UFN_DOMAIN_VALUES_SEL-ESTADO', keyData: "listStatus" },
            { rb: getValuesFromDomain('PROVEEDOR'), key: 'UFN_DOMAIN_VALUES_SEL-PROVEEDOR', keyData: "listSupplier" },
            { rb: getValuesFromDomain('METODOPAGO'), key: 'UFN_DOMAIN_VALUES_SEL-METODOPAGO', keyData: "listPaymentMethod" },
            { rb: getProductSel(0), key: 'UFN_PRODUCT_SEL', keyData: "listProduct" },
        ],
    });

    useEffect(() => {
        giveMeData();
    }, []);

    const onSubmit = handleSubmit((data) => onSubmitData(customerIns(data, data.clientid > 0 ? "UPDATE" : "INSERT")));

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
                                    {id === 'new' ? 'Nueva Orden de Compra' : 'Modificar Orden de Compra'}
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

                    <Box className="p-6">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
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
                                <FieldEdit
                                    label={'Fecha'}
                                    type="date"
                                    valueDefault={getValues('date')}
                                    onChange={(value) => setValue('date', `${value}`)}
                                    error={errors.date?.message}
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                    <Box className="px-6">
                        <Typography variant="h6">
                            Total: {(getValues('products').reduce((acc, item) => acc + item.subtotal, 0)).toFixed(2)}

                        </Typography>
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
                                    disabled={getValues('products').reduce((acc, item) => acc + item.subtotal, 0) === 0}
                                />
                            </Tabs>
                        </Box>
                    </Box >
                    <Box >
                        <TabPanel value={tab} index={0}>
                            <PurchaseProducts
                                control={control}
                                loading={loading}
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
                </Paper >
            </FormProvider>
        </Box >
    );
};

export default ManagePurchase;