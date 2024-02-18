/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Button, Grid, Paper, Typography } from '@mui/material';
import { domainIns, getValuesFromDomain } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getMultiCollection, resetMultiMain } from 'stores/main/actions';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import paths from 'common/constants/paths';
import { showBackdrop, showSnackbar } from 'stores/popus/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import SaveIcon from '@mui/icons-material/Save';
import DomainValueDialog from './DomainValueDialog';
import { useSendFormApi } from 'hooks/useSendFormApi';
import { IDomainValue, ObjectZyx } from '@types';

interface IDataAux {
    listStatus: ObjectZyx[];
    domainValues: IDomainValue[];
}

const columns: ColumnDef<IDomainValue>[] = [
    {
        header: 'DOMINIO',
        accessorKey: 'domainname',
        enableResizing: false,
        size: 10,
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
    const [openDomainValueDialog, setOpenDomainValueDialog] = useState(false);
    const multiResult = useSelector((state: IRootState) => state.main.multiData);
    const executeResult = useSelector((state: IRootState) => state.main.execute);
    const [domainValueSelected, setDomainValueSelected] = useState<IDomainValue>({ domainname: `${domainname}`, domainid: 0, domaindesc: '', domainvalue: '' })
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], domainValues: [] });
    const [waitSave, setWaitSave] = useState(false);

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: () => {
            fetchData();
        },
    });

    const fetchData = () => {
        dispatch(
            getMultiCollection([
                getValuesFromDomain(`${domainname}`)
            ]),
        )
    }

    useEffect(() => {
        dispatch(
            getMultiCollection([
                getValuesFromDomain(`${domainname}`),
                getValuesFromDomain('ESTADO'),
            ]),
        );
    }, [dispatch]);

    useEffect(() => {
        if (!multiResult.loading && !multiResult.error) {
            const domainValues = (multiResult.data.find((f) => f.key === `UFN_DOMAIN_VALUES_SEL-${domainname}`)?.data ?? []) as unknown as IDomainValue[];
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

    const selectDomainValue = (row: IDomainValue | null) => {
        setOpenDomainValueDialog(true);
        setDomainValueSelected(row ?? { domainname: `${domainname}`, domainid: 0, domaindesc: '', domainvalue: '' })
    }


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
                <Paper className="w-full mt-6" sx={{ marginTop: 0 }}>
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
                                    columnKey={"domainnamex"}
                                    optionsMenu={[{
                                        description: "Eliminar",
                                        Icon: DeleteIcon,
                                        onClick: (domainValue) => {
                                            domainValue && onSubmitData(domainIns(domainValue, "DELETE"))
                                        }
                                    }]}
                                    columns={columns}
                                    onClickOnRow={selectDomainValue}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>
            <DomainValueDialog
                openModal={openDomainValueDialog}
                setOpenModal={setOpenDomainValueDialog}
                domainValue={domainValueSelected}
                onSave={fetchData}
            />
        </>
    );
};

export default ManageDomain;
