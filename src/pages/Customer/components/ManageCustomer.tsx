/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { customerIns, getCustomerSel, getValuesFromDomain } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { useForm } from 'react-hook-form';
import { IMainProps, ICustomer, ObjectZyx } from '@types';
import SaveIcon from '@mui/icons-material/Save';
import { useSendFormApi } from 'hooks/useSendFormApi';
import { useMultiData } from 'hooks/useMultiData';
import axios from 'axios';
interface IDataAux {
    listDocumentType: ObjectZyx[];
    listStatus: ObjectZyx[];
}

const fetchDocument = async (type: string, document: string) => {
    try {
        // const urlparams = type === "RUC" ? `ruc?numero=${document}` : `dni?numero=${document}`
        const response = await axios.post('http://38.242.249.178:6014/api/main/getdocument', {
            document, type
        }, {
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

export const ManageCustomer: React.FC<IMainProps> = ({ baseUrl, onlyForm, callback }) => {
    const navigate = useNavigate();

    const { id } = useParams<{ id?: string }>();
    const [dataAux, setDataAux] = useState<IDataAux>({ listDocumentType: [], listStatus: [] });

    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => {
            if (!onlyForm) {
                navigate(baseUrl);
            }
            callback && callback();
        }
    });

    const { register, handleSubmit, setValue, getValues, reset, formState: { errors }, trigger } = useForm<ICustomer>({
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

    const { giveMeData, loading } = useMultiData<ICustomer, IDataAux>({
        registerX: () => {
            register('clientid');
            register('name', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('status', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('address');
            register('phone');
            register('document');
            register('email');
        },
        reset,
        setDataAux,
        collections: [
            ...((id !== 'new' && !onlyForm) ? [{
                rb: getCustomerSel(parseInt(`${id}`)),
                key: 'UFN_CLIENT_SEL',
                keyData: "",
                main: true,
            }] : []),
            { rb: getValuesFromDomain('TIPODOCUMENTO'), key: 'UFN_DOMAIN_VALUES_SEL-TIPODOCUMENTO', keyData: "listDocumentType" },
            { rb: getValuesFromDomain('ESTADO'), key: 'UFN_DOMAIN_VALUES_SEL-ESTADO', keyData: "listStatus" },
        ],
    });

    useEffect(() => {
        giveMeData();
    }, []);

    const onSubmit = handleSubmit((data) => onSubmitData(customerIns(data, data.clientid > 0 ? "UPDATE" : "INSERT")));

    const handlerChangeDocument = (value?: string | null) => {
        const document = value ? `${value}` : "";

        setValue('document', document);
        const type = getValues('document_type');
        if ((document.length === 8 && type === "DNI") || (document.length === 11 && type === "RUC")) {
            fetchDocument(type, document).then(res => {
                if (res) {
                    const { nombres, apellidoPaterno, apellidoMaterno, razonSocial } = res;
                    setValue('name', razonSocial || `${nombres} ${apellidoPaterno} ${apellidoMaterno}`);
                    trigger('name');
                }
            })
        }
    }

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            {!onlyForm &&
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="blue" to={baseUrl}>
                            <Typography color="secondary" fontWeight={500}>Cliente</Typography>
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
            }
            <Paper className="w-full mt-6" component={'form'} onSubmit={onSubmit} elevation={onlyForm ? 0 : 1} sx={{ marginTop: 0 }}>
                <Grid container className="border-b" paddingLeft={2} paddingRight={2} paddingTop={1} paddingBottom={1}>
                    <Grid item xs={12} sm={6}>
                        <Box>
                            <Typography variant="h5">
                                {(id === 'new' || onlyForm) ? 'Nuevo Cliente' : 'Modificar Cliente'}
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
                <Box padding={2}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <FieldSelect
                                label={'Tipo de documento'}
                                variant="outlined"
                                valueDefault={getValues('document_type')}
                                onChange={(value) => {
                                    setValue('document_type', value?.domainvalue as string ?? "");
                                    trigger('document_type');
                                }}
                                error={errors.document_type?.message}
                                loading={loading}
                                data={dataAux.listDocumentType}
                                optionDesc="domainvalue"
                                optionValue="domainvalue"
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FieldEdit
                                label={'Documento'}
                                valueDefault={getValues('document')}
                                onChange={handlerChangeDocument}
                                error={errors.document?.message}
                                variant="outlined"
                            />
                        </Grid>
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
                        <Grid item xs={12} sm={4}>
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
                                label={'Estado'}
                                variant="outlined"
                                valueDefault={getValues('status')}
                                onChange={(value) => setValue('status', value?.domainvalue as string ?? "")}
                                error={errors.status?.message}
                                loading={loading}
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

export default ManageCustomer;