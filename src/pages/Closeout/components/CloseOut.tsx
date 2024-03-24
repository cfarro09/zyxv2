import { Box, Grid, Paper, Tab, Tabs, Typography } from '@mui/material';
import { a11yProps, expenseIns, formatMoney, getExpenses, getLastCash, getSalePayment } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, getCollectionAux, getCollectionAux2, resetMain, resetMainAux, resetMainAux2 } from 'stores/main/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { IExpense, ISale } from '@types';
import dayjs from 'dayjs';
import Filters from './FiltersReport';
import { Delete } from '@mui/icons-material';
import TabPanel from 'components/Layout/TabPanel';
import ExpenseDialog from './ExpenseDialog';
import { useSendFormApi } from 'hooks/useSendFormApi';

const columns: ColumnDef<ISale>[] = [
    {
        header: 'FECHA',
        accessorKey: 'createdate',
        id: 'createdate',
    },
    {
        header: 'METODO DE PAGO',
        accessorKey: 'payment_method',
        id: 'payment_method',
    },
    {
        header: 'TRANSACCIONES',
        accessorKey: 'count',
        id: 'count',
        meta: {
			type: "number"
		}
    },
    {
        header: 'TOTAL',
        accessorKey: 'total',
        id: 'total',
        meta: {
			type: "number"
		},
        cell: (info) => "S/ " + formatMoney(`${info.row.original.total}`),
    },
];

const columnsExpense: ColumnDef<IExpense>[] = [
    {
        header: 'EGRESO',
        accessorKey: 'description',
        id: 'description',
    },
    {
        header: 'FECHA',
        accessorKey: 'expense_date',
        id: 'expense_date',
    },
    {
        header: 'MONTO',
        accessorKey: 'expense_amount',
        id: 'expense_amount',
        meta: {
            type: "number"
        },
        cell: (info) => "S/ " + formatMoney(`${info.row.original.expense_amount}`),
    },
    {
        header: 'REGISTRADO POR',
        accessorKey: 'changeby',
        id: 'changeby',
    },
    {
        header: 'FECHA REGISTRO',
        accessorKey: 'createdate',
        id: 'createdate',
        cell: (info) => new Date(info.row.original.createdate ?? "").toLocaleString()
    },
];



export const CloseOut: React.FC = () => {
    const dispatch = useDispatch();
    const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const mainResult1 = useSelector((state: IRootState) => state.main.mainAux);
    const mainResult2 = useSelector((state: IRootState) => state.main.mainAux2);
    const [mainData, setMainData] = useState<ISale[]>([]);
    const [mainExpenseData, setMainExpenseData] = useState<IExpense[]>([]);
    const [tab, setTab] = React.useState(0);
    const [current, setCurrent] = useState(0)
    const [yesterday, setYesterday] = useState(0)
    const [expenses, setExpenses] = useState(0)
    const [expenseSelected, setExpenseSelected] = useState<IExpense>(null!)

    const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => setTab(newValue);
    const [filters, setFilters] = useState<{ startdate: Date; enddate: Date; }>({
        startdate: dayjs().toDate(),
        enddate: dayjs().toDate(),
    })

    useEffect(() => {
        dispatch(getCollectionAux(getLastCash(filters.startdate)))
    }, [filters])


    const fetchDataIncome = useCallback(() => dispatch(getCollection(getSalePayment(filters))), [dispatch, filters]);

    const fetchDataExpenses = useCallback(() => dispatch(getCollectionAux2(getExpenses(0, filters, 'CAJERO'))), [dispatch, filters]);

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: fetchDataExpenses
    });

    useEffect(() => {
        // fetchDataExpenses()
        return () => {
            dispatch(resetMain());
            dispatch(resetMainAux());
            dispatch(resetMainAux2());
        }
    }, []);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            if (mainResult.key === 'UFN_SALE_PAYMENTS_RESUME_REPORT') {
                setCurrent(mainResult.data.find(x => x.payment_method === "EFECTIVO")?.total ?? 0)
                setMainData((mainResult.data as ISale[]) || []);
            }
        }
    }, [mainResult]);

    useEffect(() => {
        if (!mainResult2.loading && !mainResult2.error) {
            if (mainResult2.key === "UFN_EXPENSE_SEL") {
                setExpenses((mainResult2.data).reduce((acc, item) => acc + parseFloat(item.expense_amount ?? "0"), 0))
                setMainExpenseData((mainResult2.data as IExpense[]) || []);
            }
        }
    }, [mainResult2]);

    useEffect(() => {
        if (!mainResult1.loading && !mainResult1.error) {
            if (mainResult1.key === "UFN_LAST_CASH_SEL") {
                setYesterday((mainResult1.data[0]?.money ?? 0) - ((mainResult1.data[0]?.expense ?? 0)))
            }
        }
    }, [mainResult1]);

    const selectExpense = (row: IExpense | null) => {
        setOpenExpenseDialog(true);
        setExpenseSelected(row ?? { expenseid: 0, description: '', expense_amount: 0, evidence_url: '', expense_date: dayjs().format('YYYY-MM-DD'), status: "ACTIVO", type: 'CAJERO' })
    }

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <Paper className="w-full mt-3">
                    <Box className="px-6 py-3 border-b">
                        <Typography variant="h5">Caja</Typography>
                    </Box>
                    <Box className="px-6 py-3 border-b" sx={{ width: '100%' }}>
                        <Grid container xs={4}>
                            <Grid container>
                                <Grid item xs={6}>Efectivo de ayer</Grid>
                                <Grid item xs={6} textAlign={"right"}>S/ {yesterday.toFixed(2)}</Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={6}>Efectivo del día</Grid>
                                <Grid item xs={6} textAlign={"right"}>S/ {current.toFixed(2)}</Grid>
                            </Grid>
                            <Grid container color={"red"} className=' border-b'>
                                <Grid item xs={6}>Gastos del día</Grid>
                                <Grid item xs={6} textAlign={"right"}>S/ {expenses.toFixed(2)}</Grid>
                            </Grid>
                            <Grid container fontWeight={500}>
                                <Grid item xs={6}>Cierre del día</Grid>
                                <Grid item xs={6} textAlign={"right"}>S/ {(current + yesterday - expenses).toFixed(2)}</Grid>
                            </Grid>
                        </Grid>

                    </Box>
                    <Box className="px-6" sx={{ width: '100%' }}>
                        <Box sx={{ width: '100%', }}>
                            <Tabs
                                value={tab}
                                onChange={handleChangeTab}
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Ingresos" {...a11yProps(0)} />
                                <Tab
                                    label="Egresos" {...a11yProps(1)}
                                />
                            </Tabs>
                        </Box>
                    </Box>
                    <Box>
                        <TabPanel value={tab} index={0}  >
                            <TableSimple
                                loading={mainResult.loading}
                                data={mainData}
                                titlemodule='caja'
                                addButton={false}
                                filterElement={
                                    <Filters
                                        filters={filters}
                                        setFilters={setFilters}
                                        fetchData={fetchDataIncome}
                                    />
                                }
                                columns={columns}
                                redirectOnSelect={true}
                                columnKey={"name"}
                            />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <TableSimple
                                data={mainExpenseData}
                                addButton={true}
                                showOptions={true}
                                columnKey={"expenseid"}
                                titlemodule='egresos'
                                filterElement={
                                    <Filters
                                        filters={filters}
                                        setFilters={setFilters}
                                        fetchData={fetchDataExpenses}
                                    />
                                }
                                optionsMenu={[{
                                    description: "Eliminar",
                                    Icon: Delete,
                                    onClick: (expense) => {
                                        expense && onSubmitData(expenseIns({ ...expense, operation: "DELETE" }))
                                    }
                                }]}
                                columns={columnsExpense}
                                onClickOnRow={selectExpense}
                            />
                        </TabPanel>
                    </Box>
                </Paper>
            </Box>
            <ExpenseDialog
                openDialog={openExpenseDialog}
                setOpenDialog={setOpenExpenseDialog}
                expense={expenseSelected}
                onSave={fetchDataExpenses}
            />
        </>
    );
};

export default CloseOut;