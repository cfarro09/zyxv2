/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { customerIns, getCustomerSel, getValuesFromDomain } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getMultiCollection, resetMultiMain } from 'stores/main/actions';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { useForm } from 'react-hook-form';
import { IMainProps, ICustomer, ObjectZyx } from '@types';
import SaveIcon from '@mui/icons-material/Save';
import { useSendFormApi } from 'hooks/useSendFormApi';
interface IDataAux {
    listDocumentType: ObjectZyx[];
    listStatus: ObjectZyx[];
}

export const ManageAccount: React.FC<IMainProps> = ({ baseUrl }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id } = useParams<{ id?: string }>();
    const multiResult = useSelector((state: IRootState) => state.main.multiData);
    const [dataAux, setDataAux] = useState<IDataAux>({ listDocumentType: [], listStatus: [] });
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => navigate(baseUrl),
    });
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<ICustomer>({
        defaultValues: {
            clientid: 0,
            name: '',
            address: '',
            phone: '',
            document: '',
            document_type: 'DNI',
            email: '',
            status: 'ACTIVO',
        },
    });

    const registerX = () => {
        register('clientid');
        register('name', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('status', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('address');
        register('phone');
        register('document');
        register('email');
    };

    useEffect(() => {
        registerX();
        dispatch(
            getMultiCollection([
                ...(id !== 'new' ? [getCustomerSel(parseInt(`${id}`))] : []),
                getValuesFromDomain('TIPODOCUMENTO'),
                getValuesFromDomain('ESTADO'),
            ]),
        );
    }, [dispatch, register, id]);

    useEffect(() => {
        if (!multiResult.loading && !multiResult.error) {
            const rows = multiResult.data.find((f) => f.key === `UFN_CLIENT_SEL`)?.data ?? [];
            if (rows.length > 0) {
                reset(rows[0]);
            }
            registerX()
            const listDocumentType = multiResult.data.find(f => f.key === `UFN_DOMAIN_VALUES_SEL-TIPODOCUMENTO`)?.data ?? [];
            const listStatus = multiResult.data.find(f => f.key === `UFN_DOMAIN_VALUES_SEL-ESTADO`)?.data ?? [];
            setDataAux({ listDocumentType, listStatus });
        }
    }, [multiResult]);

    useEffect(() => {
        return () => {
            dispatch(resetMultiMain())
        }
    }, []);

    const onSubmit = handleSubmit((data) => onSubmitData(customerIns(data, data.clientid > 0 ? "UPDATE" : "INSERT")));

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <div className="my-3">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textPrimary" to={baseUrl}>
                        Cliente
                    </Link>
                    <Typography color="textSecondary">Detalle</Typography>
                </Breadcrumbs>
            </div>
            <Paper className="w-full mt-6" component={'form'} onSubmit={onSubmit} sx={{ marginTop: 0 }}>
                <Grid container className="px-6 py-3 border-b">
                    <Grid item xs={12} sm={6}>
                        <Box>
                            <Typography variant="h5">
                                {id === 'new' ? 'Nuevo Cliente' : 'Modificar Cliente'}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} container justifyContent={'flex-end'} gap={2}>
                        <Button
                            color='primary'
                            type='submit'
                            startIcon={<SaveIcon />}
                            disabled={multiResult.loading}
                            variant="contained">Guardar
                        </Button>
                    </Grid>
                </Grid>
                <Box className="p-6">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={8}>
                            <FieldEdit
                                label={'Nombre Completo'}
                                valueDefault={getValues('name')}
                                onChange={(value) => setValue('name', `${value}`)}
                                error={errors.name?.message}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldEdit
                                label={'Teléfono'}
                                valueDefault={getValues('phone')}
                                onChange={(value) => setValue('phone', `${value}`)}
                                error={errors.phone?.message}
                                type='phone'
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <FieldEdit
                                label={'Dirección'}
                                valueDefault={getValues('address')}
                                onChange={(value) => setValue('address', `${value}`)}
                                error={errors.address?.message}
                                type='address'
                                variant="outlined"
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <FieldEdit
                                label={'Correo'}
                                valueDefault={getValues('email')}
                                onChange={(value) => setValue('email', `${value}`)}
                                error={errors.email?.message}
                                type='email'
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldSelect
                                label={'Tipo de documento'}
                                variant="outlined"
                                valueDefault={getValues('document_type')}
                                onChange={(value) => setValue('document_type', `${value?.domainvalue}`)}
                                error={errors.document_type?.message}
                                loading={multiResult.loading}
                                data={dataAux.listDocumentType}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldEdit
                                label={'Documento'}
                                valueDefault={getValues('document')}
                                onChange={(value) => setValue('document', `${value}`)}
                                error={errors.document?.message}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldSelect
                                label={'Estado'}
                                variant="outlined"
                                valueDefault={getValues('status')}
                                onChange={(value) => setValue('status', `${value?.domainvalue}`)}
                                error={errors.status?.message}
                                loading={multiResult.loading}
                                data={dataAux.listStatus}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Box>
    );
};

export default ManageAccount;