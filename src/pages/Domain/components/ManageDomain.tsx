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
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import PasswordDialog from './PasswordDialog';
import { IDomainValue, ObjectZyx } from '@types';
import paths from 'common/constants/paths';
import { manageConfirmation, showBackdrop, showSnackbar } from 'stores/popus/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import SaveIcon from '@mui/icons-material/Save';

interface IDataAux {
    listStatus: ObjectZyx[];
    domainValues: IDomainValue[];
}

const columns: ColumnDef<IDomainValue>[] = [
    {
        header: 'DOMINIO',
        accessorKey: 'domainname',
    },
    {
        header: 'DESCRIPCION',
        accessorKey: 'domaindesc',
    },
    {
        header: 'VALOR',
        accessorKey: 'domainvalue',
    }
];

export const ManageDomain: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id: domainname } = useParams<{ id?: string }>();

    console.log("domainname", domainname)
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
    const multiResult = useSelector((state: IRootState) => state.main.multiData);
    const executeResult = useSelector((state: IRootState) => state.main.execute);
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], domainValues: [] });
    const [waitSave, setWaitSave] = useState(false);
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<IDomainValue>({
        defaultValues: {
            // userid: 0,
            // username: '',
            // roleid: 0,
            // rolename: '',
            // firstname: '',
            // password: '',
            // lastname: '',
            // document: '',
            // document_type: '',
            // email: '',
            // status: 'ACTIVO',
        },
    });

    const registerX = () => {
        // register('userid');
        // register('username', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        // register('password');
        // register('firstname', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        // register('status', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        // register('lastname', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        // register('document', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        // register('document_type', { validate: (value) => Boolean(value?.length) || 'El campo es requerido' });
        // register('email');
        // register('roleid', { validate: (value) => Boolean(value) || 'El campo es requerido' });
    };

    useEffect(() => {
        registerX();
        dispatch(
            getMultiCollection([
                getValuesFromDomain(`${domainname}`),
                getValuesFromDomain('ESTADO'),
            ]),
        );
    }, [dispatch, register]);

    useEffect(() => {
        if (!multiResult.loading && !multiResult.error) {
            const domainValues = (multiResult.data.find((f) => f.key === `UFN_DOMAIN_VALUES_SEL-${domainname}`)?.data ?? []) as unknown as IDomainValue[];
            // if (rows.length > 0) {
            //     // reset(rows[0]);
            // }
            // registerX()
            const listStatus = multiResult.data.find(f => f.key === `UFN_DOMAIN_VALUES_SEL-ESTADO`)?.data ?? [];

            setDataAux({ listStatus, domainValues });
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
        // if (data.userid === 0 && !data.password) {
        //     dispatch(showSnackbar({ show: true, severity: "warning", message: `Debe ingresar contraseña` }));
        // } else {
        //     const callback = () => {
        //         dispatch(showBackdrop(true));
        //         dispatch(execute(userIns({
        //             ...data,
        //             password: data.password ?? "",
        //             operation: data.userid > 0 ? "UPDATE" : "INSERT"
        //         })));
        //         setWaitSave(true);
        //     }

        //     dispatch(manageConfirmation({
        //         visible: true,
        //         question: "¿Está seguro de continuar?",
        //         callback
        //     }))
        // }
    });

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to={paths.DOMAINS}>
                            Dominios
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
                <Paper className="w-full mt-6" component={'form'} onSubmit={onSubmit} sx={{ marginTop: 0 }}>
                    <Grid container className="px-6 py-3 border-b">
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="h5">
                                    Modificar dominio
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
                            <Grid item xs={12} sm={12}>
                                <TableSimple
                                    loading={multiResult.loading}
                                    data={dataAux.domainValues}
                                    addButton={true}
                                    showOptions={true}
                                    optionsMenu={[{
                                        description: "Eliminar",
                                        Icon: DeleteIcon,
                                        onClick: (user) => null
                                    }]}
                                    columns={columns}
                                    redirectOnSelect={true}
                                    columnKey={"domainid"}
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

export default ManageDomain;
