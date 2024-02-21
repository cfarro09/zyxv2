/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { getRoles, getUserSel, getValuesFromDomain, userIns } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { useForm } from 'react-hook-form';
import PasswordDialog from './PasswordDialog';
import { IMainProps, IUser, ObjectZyx } from '@types';
import { showSnackbar } from 'stores/popus/actions';
import SaveIcon from '@mui/icons-material/Save';
import HttpsIcon from '@mui/icons-material/Https';
import { useSendFormApi } from 'hooks/useSendFormApi';
import { useMultiData } from 'hooks/useMultiData';
interface IDataAux {
    listDocumentType: ObjectZyx[];
    listStatus: ObjectZyx[];
    listRoles: ObjectZyx[];
}

export const ManageUser: React.FC<IMainProps> = ({ baseUrl }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams<{ id?: string }>();
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const [dataAux, setDataAux] = useState<IDataAux>({ listDocumentType: [], listStatus: [], listRoles: [] });
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
    } = useForm<IUser>({
        defaultValues: {
            userid: 0,
            username: '',
            roleid: 0,
            rolename: '',
            firstname: '',
            password: '',
            lastname: '',
            document: '',
            document_type: '',
            email: '',
            status: 'ACTIVO',
        },
    });

    const { giveMeData, loading } = useMultiData<IUser, IDataAux>({
        registerX: () => {
            register('userid');
            register('username', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('password', id === 'new' ? { validate: (value) => Boolean(value?.length) || '**Debe ingresar una contraseña' } : undefined);
            register('firstname', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('status', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('lastname', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('document', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('document_type', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
            register('email');
            register('roleid', { validate: (value) => Boolean(value) || 'El campo es requerido' });
        },
        reset,
        setDataAux,
        collections: [
            ...(id !== 'new' ? [{
                rb: getUserSel(parseInt(`${id}`)),
                key: 'UFN_USERS_SEL',
                keyData: "",
                main: true,
            }] : []),
            { rb: getValuesFromDomain('TIPODOCUMENTO'), key: 'UFN_DOMAIN_VALUES_SEL-TIPODOCUMENTO', keyData: "listDocumentType" },
            { rb: getValuesFromDomain('ESTADO'), key: 'UFN_DOMAIN_VALUES_SEL-ESTADO', keyData: "listStatus" },
            { rb: getRoles(), key: 'UFN_ROLE_LIST', keyData: "listRoles" },
        ],
    });

    useEffect(() => {
        giveMeData();
    }, []);

    const onSubmit = handleSubmit((data) => {
        if (data.userid === 0 && !data.password) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: `Debe ingresar contraseña` }));
        } else {
            onSubmitData(userIns({
                ...data,
                password: data.password ?? "",
                operation: data.userid > 0 ? "UPDATE" : "INSERT"
            }));
        }
    });

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to={baseUrl}>
                            <Typography color="secondary" fontWeight={500}>Usuarios</Typography>
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
                <Paper className="w-full mt-6" component={'form'} onSubmit={onSubmit} sx={{ marginTop: 0 }}>
                    <Grid container className="px-6 py-3 border-b">
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="h5">
                                    {id === 'new' ? 'Nuevo usuario' : 'Modificar Usuario'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} container justifyContent={'flex-end'} gap={2}>
                            <Button
                                color="info"
                                onClick={() => setOpenPasswordDialog(true)}
                                type='button'
                                disabled={loading}
                                startIcon={<HttpsIcon />}
                                variant="contained">
                                {id !== "new" ? "Cambiar contraseña" : "Ingresar contraseña"}
                            </Button>
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
                            {errors.password?.message && (
                                <Grid item xs={12} sx={{ color: '#d32f2f' }}>
                                    {errors.password?.message}
                                </Grid>
                            )}
                            <Grid item xs={12} sm={4}>
                                <FieldEdit
                                    label={'Nombre'}
                                    valueDefault={getValues('firstname')}
                                    onChange={(value) => setValue('firstname', `${value}`)}
                                    error={errors.firstname?.message}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldEdit
                                    label={'Apellido'}
                                    valueDefault={getValues('lastname')}
                                    onChange={(value) => setValue('lastname', `${value}`)}
                                    error={errors.lastname?.message}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldEdit
                                    label={'Email'}
                                    valueDefault={getValues('email')}
                                    onChange={(value) => setValue('email', `${value}`)}
                                    error={errors.email?.message}
                                    type='email'
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldEdit
                                    label={'Usuario'}
                                    valueDefault={getValues('username')}
                                    onChange={(value) => setValue('username', `${value}`)}
                                    error={errors.username?.message}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldSelect
                                    label={'Tipo de documento'}
                                    variant="outlined"
                                    valueDefault={getValues('document_type')}
                                    onChange={(value) => setValue('document_type', value?.domainvalue as string ?? "")}
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
                                    onChange={(value) => setValue('document', `${value}`)}
                                    error={errors.document?.message}
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FieldSelect
                                    label={'Role'}
                                    variant="outlined"
                                    valueDefault={getValues('roleid')}
                                    onChange={(value) => setValue('roleid', (value?.roleid as number) || 0)}
                                    error={errors.roleid?.message}
                                    loading={loading}
                                    data={dataAux.listRoles}
                                    optionDesc="rolename"
                                    optionValue="roleid"
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
            <PasswordDialog
                openDialog={openPasswordDialog}
                setOpenDialog={setOpenPasswordDialog}
                parentSetValue={setValue}
            />
        </>
    );
};

export default ManageUser;