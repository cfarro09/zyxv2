import { Box, Breadcrumbs, Paper, Typography } from "@mui/material";
import { IMainProps } from "@types";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IKardex, IKardexFilter } from "../models";
import type { ColumnDef } from "@tanstack/react-table";
import TableSimple from "components/Controls/TableSimple";
import { getCollection } from "stores/main/actions";
import { getKardexSel } from "common/helpers";
import { IRootState } from "stores";
import { useDispatch, useSelector } from "react-redux";
import type { Range } from "react-date-range";
import KardexFilters from "./KardexFilters";
import dayjs from "dayjs";

const initialRange: Range = {
    startDate: dayjs().subtract(1, 'month').toDate(),
    endDate: dayjs().add(1, 'day').toDate(),
    key: 'selection',
}

const columns: ColumnDef<IKardex>[] = [
    {
        header: 'FECHA',
        accessorKey: 'createdate',
        cell: (info) => (<span>{dayjs(info.row.original.createdate).format('DD/MM/YYYY HH:mm:ss')}</span>)
    },
    {
        header: 'ENTRADA',
        accessorKey: 'in_quantity',
        cell: (info) => (<Typography align="center">{info.row.original.in_quantity}</Typography>),
        meta: {
            align: 'center'
        }
    },
    {
        header: 'SALIDA',
        accessorKey: 'out_quantity',
        cell: (info) => (<Typography align="center">{info.row.original.out_quantity}</Typography>),
        meta: {
            align: 'center'
        }
    },
    {
        header: 'DOCUMENTO',
        accessorKey: 'document_type',
        cell: (info) => {
            const { document_type, document_id } = info.row.original;
            let url = '';
            if (document_type === 'compra') url = '/purchase_orders';
            if (document_type === 'venta') url = '/sale_orders';
            if (['compra', 'venta'].includes(document_type)) {
                return (
                    <Link to={`${url}/${document_id}`}>
                        <Typography color={'primary'}>{document_type.toUpperCase()}</Typography>
                    </Link>
                )
            } else {
                return (<Typography color={'primary'}>{document_type.toUpperCase()}</Typography>)
            }
        }
    },
    {
        header: 'BALANCE',
        accessorKey: 'final_stock',
        cell: (info) => (<Typography align="center">{info.row.original.final_stock}</Typography>),
        meta: {
            align: 'center'
        }
    },
    {
        header: 'REGISTRADO POR',
        accessorKey: 'createdby',
    },
]

export const Kardex: React.FC<IMainProps> = ({ baseUrl }) => {
    const dispatch = useDispatch();
    const { id } = useParams<{ id?: string }>();
    const [mainData, setMainData] = useState<IKardex[]>([]);
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [filters, setFilters] = useState<IKardexFilter>({
        startdate: initialRange.startDate as Date,
        enddate: initialRange.endDate as Date,
        inventoryid: parseInt(id as string)
    })

    const fetchData = () => {
        dispatch(getCollection(getKardexSel({ ...filters })))
    }

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_KARDEX_SEL') {
            setMainData((mainResult.data as IKardex[]) || []);
        }
    }, [mainResult]);

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <div className="mt-3 mx-1">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textPrimary" to={baseUrl + window.location.search}>
                        <Typography color="secondary" fontWeight={500}>Inventario</Typography>
                    </Link>
                    <Typography color="textSecondary">Kardex</Typography>
                </Breadcrumbs>
            </div>
            <Paper className="w-full mt-3">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">
                        {mainData?.[0]?.title}
                        <Typography component={'span'} fontSize={14} marginLeft={2}>
                            ({mainData?.[0]?.warehouse})
                        </Typography>
                    </Typography>
                </Box>
                <Box>
                    <TableSimple
                        loading={mainResult.loading}
                        data={mainData}
                        columns={columns}
                        columnKey={"kardexid"}
                        enableGlobalFilter={false}
                        filterElement={
                            <KardexFilters
                                filters={filters}
                                setFilters={setFilters}
                                fetchData={fetchData}
                            />
                        }
                    />
                </Box>
            </Paper>
        </Box>
    );
};
