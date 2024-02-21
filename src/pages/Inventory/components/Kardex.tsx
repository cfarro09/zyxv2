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

    const columns: ColumnDef<IKardex>[] = [
        {
            header: 'FECHA',
            accessorKey: 'createdate',
            cell: (info) => (<span>{dayjs(info.row.original.createdate).format('DD/MM/YYYY HH:mm:ss')}</span>)
        },
        {
            header: 'ALMACEN',
            accessorKey: 'warehouse'
        },
        {
            header: 'ENTRADA',
            accessorKey: 'in_quantity'
        },
        {
            header: 'SALIDA',
            accessorKey: 'out_quantity'
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
            accessorKey: 'final_stock'
        },
    ]


    console.log({ now: dayjs().toDate() })

    const fetchData = () => {
        dispatch(getCollection(getKardexSel({ ...filters })))
    }

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error && mainResult.key === 'UFN_KARDEX_SEL') {
            setMainData((mainResult.data as IKardex[]) || []);
        }
    }, [mainResult]);


    useEffect(() => {
        fetchData()
        // giveMeData();
    }, []);

    useEffect(() => {
        fetchData();
    }, [filters]);

    return (
        <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
            <div className="mt-3 mx-1">
                <Breadcrumbs aria-label="breadcrumb">
                    <Link color="textPrimary" to={baseUrl}>
                        <Typography color="secondary" fontWeight={500}>Inventario</Typography>
                    </Link>
                    <Typography color="textSecondary">Kardex</Typography>
                </Breadcrumbs>
            </div>
            <Paper className="w-full mt-6">
                <Box className="px-6 py-3 border-b">
                    <Typography variant="h5">
                        Kardex
                        <Typography component={'span'} fontSize={14}>
                            - ALMACEN PRINCIPAL
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
