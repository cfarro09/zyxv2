/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { getRoles, getUserSel, getValuesFromDomain, userIns } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { execute, getMultiCollection, resetMultiMain } from 'stores/main/actions';
import { Link, useParams, useNavigate } from 'react-router-dom';
import FieldEdit from 'components/Controls/FieldEdit';
import { FieldSelect } from 'components/Controls/FieldSelect';
import { useForm } from 'react-hook-form';
import PasswordDialog from './PasswordDialog';
import { IUser, ObjectZyx } from '@types';
import paths from 'common/constants/paths';
import { manageConfirmation, showBackdrop, showSnackbar } from 'stores/popus/actions';

interface IDataAux {
    listDocumentType: ObjectZyx[];
    listStatus: ObjectZyx[];
    listRoles: ObjectZyx[];
}

export const ManageUser: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams<{ id?: string }>();
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const multiResult = useSelector((state: IRootState) => state.main.multiData);
    const executeResult = useSelector((state: IRootState) => state.main.execute);
    const [dataAux, setDataAux] = useState<IDataAux>({ listDocumentType: [], listStatus: [], listRoles: [] });
    const [waitSave, setWaitSave] = useState(false);
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


    const registerX = () => {
        register('userid');
        register('username', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('password');
        register('firstname', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('status', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('lastname', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('document', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('document_type', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        register('email');
        register('roleid', { validate: (value) => Boolean(value) || 'El campo es requerido' });
    };

    useEffect(() => {
        reset({
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
        });
        registerX();
        dispatch(
            getMultiCollection([
                ...(id !== 'new' ? [getUserSel(1, parseInt(`${id}`))] : []),
                getValuesFromDomain('TIPODOCUMENTO'),
                getValuesFromDomain('ESTADO'),
                getRoles(),
            ]),
        );
    }, [dispatch, register, id]);

    useEffect(() => {
        if (!multiResult.loading && !multiResult.error) {
            reset({
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
            });
            const rows = multiResult.data.find((f) => f.key === `UFN_USERS_SEL`)?.data ?? [];
            if (rows.length > 0) {
                reset(rows[0]);
            }
            registerX()
            const listDocumentType = multiResult.data.find(f => f.key === `UFN_DOMAIN_VALUES_SEL-TIPODOCUMENTO`)?.data ?? [];
            const listStatus = multiResult.data.find(f => f.key === `UFN_DOMAIN_VALUES_SEL-ESTADO`)?.data ?? [];
            const listRoles = multiResult.data.find(f => f.key === `UFN_ROLE_LIST`)?.data ?? [];

            setDataAux({ listDocumentType, listStatus, listRoles });
        }
    }, [multiResult]);

    useEffect(() => {
        return () => {
            dispatch(resetMultiMain())
        }
    }, []);

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                dispatch(showSnackbar({ show: true, severity: "success", message: `Guardado satisfactoriamente.` }));
                navigate(paths.USERS)
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: `${executeResult.code}` }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
    }, [navigate, executeResult, waitSave]);

    const onSubmit = handleSubmit((data) => {
        if (data.userid === 0 && !data.password) {
            dispatch(showSnackbar({ show: true, severity: "warning", message: `Debe ingresar contraseña` }));
        } else {
            const callback = () => {
                dispatch(showBackdrop(true));
                dispatch(execute(userIns({
                    ...data,
                    password: data.password ?? "",
                    operation: data.userid > 0 ? "UPDATE" : "INSERT"
                })));
                setWaitSave(true);
            }
    
            dispatch(manageConfirmation({
                visible: true,
                question: "¿Está seguro de continuar?",
                callback
            }))
        }
    });

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to="/users/">
                            Usuarios
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
                <Paper className="w-full mt-6" component={'form'} onSubmit={onSubmit} sx={{ marginTop: 0 }}>
                    <Grid container className="px-6 py-3 border-b">
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="h5">
                                    {id === '0' ? 'Nuevo usuario' : 'Modificar Usuario'}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} container justifyContent={'flex-end'} gap={2}>
                            <Button
                                color="info"
                                onClick={() => setOpenPasswordDialog(true)}
                                type='button'
                                disabled={multiResult.loading}
                                variant="contained">
                                {id !== "new" ? "Cambiar contraseña" : "Ingresar contraseña"}
                            </Button>
                            <Button
                                color='primary'
                                type='submit'
                                disabled={multiResult.loading}
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
                                    // type='email'
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
                                    label={'Role'}
                                    variant="outlined"
                                    valueDefault={getValues('roleid')}
                                    onChange={(value) => setValue('roleid', (value?.roleid as number) || 0)}
                                    error={errors.roleid?.message}
                                    loading={multiResult.loading}
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
            <PasswordDialog
                openModal={openPasswordDialog}
                setOpenModal={setOpenPasswordDialog}
                parentSetValue={setValue}
            />
        </>
    );
};

export default ManageUser;
