/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { a11yProps, customerIns, getCustomerSel, getValuesFromDomain } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { useFieldArray, useForm } from 'react-hook-form';
import { IMainProps, IPurchase, ObjectZyx } from '@types';
import SaveIcon from '@mui/icons-material/Save';
import { useSendFormApi } from 'hooks/useSendFormApi';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useMultiData } from 'hooks/useMultiData';
import { Products } from './Products';

interface IDataAux {
    listDocumentType: ObjectZyx[];
    listStatus: ObjectZyx[];
    listCustomer: ObjectZyx[];
}

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

export const ManagePurchase: React.FC<IMainProps> = ({ baseUrl }) => {
    const navigate = useNavigate();
    const [tab, settab] = React.useState(0);

    const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
        settab(newValue);
    };

    const { id } = useParams<{ id?: string }>();
    const [dataAux, setDataAux] = useState<IDataAux>({ listDocumentType: [], listStatus: [], listCustomer: [] });
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => navigate(baseUrl),
    });
    const { control, register, handleSubmit, setValue, getValues, reset, formState: { errors } } = useForm<IPurchase>({
        defaultValues: {
            purchaseorderid: 0,
            clientid: 0,
            date: '',
            status: 'ACTIVO',
            products: [],
            payments: []
        },
    });


    const { giveMeData, loading } = useMultiData<IPurchase, IDataAux>({
        registerX: () => {
            register('purchaseorderid');
            register('status');
            register('clientid', { validate: (value) => Boolean(value) || 'El campo es requerido' });
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
            { rb: getValuesFromDomain('TIPODOCUMENTO'), key: 'UFN_DOMAIN_VALUES_SEL-TIPODOCUMENTO', keyData: "listDocumentType" },
            { rb: getValuesFromDomain('ESTADO'), key: 'UFN_DOMAIN_VALUES_SEL-ESTADO', keyData: "listStatus" },
            { rb: getCustomerSel(0), key: 'UFN_CLIENT_SEL', keyData: "listCustomer" },
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
                    <Link color='secondary' to={baseUrl}>
                        <Typography color="blue">Ordenes de compra</Typography>
                    </Link>
                    <Typography color="textSecondary">Detalle</Typography>
                </Breadcrumbs>
            </div>
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
                                label={'Clientes'}
                                variant="outlined"
                                valueDefault={getValues('clientid')}
                                onChange={(value) => setValue('clientid', value?.clientid as number ?? 0)}
                                error={errors.clientid?.message}
                                loading={loading}
                                data={dataAux.listCustomer}
                                optionDesc="name"
                                optionValue="name"
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
                <Box className="px-6" sx={{ width: '100%' }}>
                    <Box sx={{ width: '100%', }}>
                        <Tabs
                            value={tab}
                            onChange={handleChangeTab}
                            indicatorColor='primary'
                            textColor='primary'
                            variant="fullWidth"
                            aria-label="full width tabs example"
                        >
                            <Tab label="Productos" {...a11yProps(0)} />
                            <Tab label="Pagos" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                </Box >
                <Box >
                    <TabPanel value={tab} index={0}>
                        <Products
                            control={control}
                        />
                    </TabPanel>
                    <TabPanel value={tab} index={1}>
                        Pagos
                    </TabPanel>
                </Box>
            </Paper >
        </Box >
    );
};

export default ManagePurchase;