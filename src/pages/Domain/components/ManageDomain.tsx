/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Breadcrumbs, Grid, Paper, Typography } from '@mui/material';
import { domainIns, getValuesFromDomain } from 'common/helpers';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getMultiCollection } from 'stores/main/actions';
import { Link, useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import DomainValueDialog from './DomainValueDialog';
import { useSendFormApi } from 'hooks/useSendFormApi';
import { IDomainValue, IMainProps, ObjectZyx } from '@types';
import { useMultiData } from 'hooks/useMultiData';

interface IDataAux {
    listStatus: ObjectZyx[];
    domainValues: IDomainValue[];
}

const columns: ColumnDef<IDomainValue>[] = [
    {
        header: 'DOMINIO',
        accessorKey: 'domainname',
        id: 'domainname',
        enableResizing: false,
    },
    {
        header: 'DESCRIPCION',
        accessorKey: 'domaindesc',
        id: 'domaindesc',
    },
    {
        header: 'VALOR',
        accessorKey: 'domainvalue',
        id: 'domainvalue',
    }
];

export const ManageDomain: React.FC<IMainProps> = ({ baseUrl }) => {
    const dispatch = useDispatch();
    const { id: domainname } = useParams<{ id?: string }>();
    const [openDomainValueDialog, setOpenDomainValueDialog] = useState(false);
    const [domainValueSelected, setDomainValueSelected] = useState<IDomainValue>({ domainname: `${domainname}`, domainid: 0, domaindesc: '', domainvalue: '' })
    const [dataAux, setDataAux] = useState<IDataAux>({ listStatus: [], domainValues: [] });

    const fetchData = () => dispatch(getMultiCollection([getValuesFromDomain(`${domainname}`)]))

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: fetchData
    });

    const { giveMeData, loading } = useMultiData<IDomainValue, IDataAux>({
        setDataAux,
        collections: [
            { rb: getValuesFromDomain(`${domainname}`), key: `UFN_DOMAIN_VALUES_SEL-${domainname}`, keyData: "domainValues" },
            { rb: getValuesFromDomain('ESTADO'), key: `UFN_DOMAIN_VALUES_SEL-ESTADO`, keyData: "listStatus" },
        ],
    });

    useEffect(() => {
        giveMeData();
    }, []);

    const selectDomainValue = (row: IDomainValue | null) => {
        setOpenDomainValueDialog(true);
        setDomainValueSelected(row ?? { domainname: `${domainname}`, domainid: 0, domaindesc: '', domainvalue: '' })
    }

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <div className="my-3">
                    <Breadcrumbs aria-label="breadcrumb">
                        <Link color="textPrimary" to={baseUrl + window.location.search}>
                            <Typography color="secondary" fontWeight={500}>Dominios</Typography>
                        </Link>
                        <Typography color="textSecondary">Detalle</Typography>
                    </Breadcrumbs>
                </div>
                <Paper className="w-full" sx={{ marginTop: 0 }}>
                    <Grid container className="px-6 py-3 border-b">
                        <Grid item xs={12} sm={6}>
                            <Box>
                                <Typography variant="h5">
                                    Modificar dominio
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box className="p-6">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TableSimple
                                    loading={loading}
                                    titlemodule={domainname}
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
                openDialog={openDomainValueDialog}
                setOpenDialog={setOpenDomainValueDialog}
                domainValue={domainValueSelected}
                onSave={fetchData}
            />
        </>
    );
};

export default ManageDomain;