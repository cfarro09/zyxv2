import { Box, Button, Paper, Tab, Tabs, Typography } from '@mui/material';
import { a11yProps, expenseIns, getExpenses, getSalePayment } from 'common/helpers';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { getCollection, resetMain } from 'stores/main/actions';
import TableSimple from 'components/Controls/TableSimple';
import type { ColumnDef } from '@tanstack/react-table';
import { IExpense, ISale } from '@types';
import dayjs from 'dayjs';
import Filters from './FiltersReport';
import { Delete, PointOfSale } from '@mui/icons-material';
import ProfitResumeDialog from './ProfitResumeDialog';
import TabPanel from 'components/Layout/TabPanel';
import ExpenseDialog from './ExpenseDialog';
import { useSendFormApi } from 'hooks/useSendFormApi';

const columns: ColumnDef<ISale>[] = [
    {
        header: 'FECHA',
        accessorKey: 'createdate',
    },
    {
        header: 'METODO DE PAGO',
        accessorKey: 'payment_method',
    },
    {
        header: 'TRANSACCIONES',
        accessorKey: 'count',
    },
    {
        header: 'TOTAL',
        accessorKey: 'total',
    },
];

const columnsExpense: ColumnDef<IExpense>[] = [
    {
        header: 'EGRESO',
        accessorKey: 'description',
    },
    {
        header: 'FECHA',
        accessorKey: 'expense_date',
    },
    {
        header: 'MONTO',
        accessorKey: 'expense_amount',
    },
];

export const Reports: React.FC = () => {
    const dispatch = useDispatch();
    const [openProfitResumeDialog, setOpenProfitResumeDialog] = useState(false);
    const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
    const mainResult = useSelector((state: IRootState) => state.main.mainData);
    const [mainData, setMainData] = useState<ISale[]>([]);
    const [mainExpenseData, setMainExpenseData] = useState<IExpense[]>([]);
    const [tab, settab] = React.useState(0);
    const [expenseSelected, setExpenseSelected] = useState<IExpense>(null!)

    const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => settab(newValue);

    const [filters, setFilters] = useState<{ startdate: Date; enddate: Date; }>({
        startdate: dayjs().toDate(),
        enddate: dayjs().toDate(),
    })

    const fetchDataIncome = useCallback(() => dispatch(getCollection(getSalePayment(filters))), [dispatch, filters]);

    const fetchDataExpenses = useCallback(() => dispatch(getCollection(getExpenses())), [dispatch]);

    const { onSubmitData } = useSendFormApi({
        operation: "DELETE",
        onSave: fetchDataExpenses
    });

    useEffect(() => {
        fetchDataExpenses()
        return () => {
            dispatch(resetMain());
        }
    }, []);

    useEffect(() => {
        if (!mainResult.loading && !mainResult.error) {
            if (mainResult.key === 'UFN_SALE_PAYMENTS_RESUME_REPORT') {
                setMainData((mainResult.data as ISale[]) || []);
            } else if (mainResult.key === "UFN_EXPENSE_SEL") {
                setMainExpenseData((mainResult.data as IExpense[]) || []);
            }
        }
    }, [mainResult]);

    const selectExpense = (row: IExpense | null) => {
        setOpenExpenseDialog(true);
        setExpenseSelected(row ?? { expenseid: 0, description: '', expense_amount: 0, evidence_url: '', expense_date: dayjs().format('YYYY-MM-DD'), status: "ACTIVO" })
    }

    return (
        <>
            <Box className="flex max-w-screen-xl mr-auto ml-auto flex-col">
                <Paper className="w-full mt-3">
                    <Box className="px-6 py-3 border-b">
                        <Typography variant="h5">Caja</Typography>
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
                                addButton={true}
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
                                buttonElement={
                                    <Button
                                        onClick={() => setOpenProfitResumeDialog(true)}
                                        variant="outlined">
                                        <PointOfSale fontSize="small" sx={{ marginRight: '4px' }} />PROFIT
                                    </Button>
                                }
                            />
                        </TabPanel>
                        <TabPanel value={tab} index={1}>
                            <TableSimple
                                data={mainExpenseData}
                                addButton={true}
                                showOptions={true}
                                columnKey={"expenseid"}
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
            <ProfitResumeDialog
                open={openProfitResumeDialog}
                handleClose={() => setOpenProfitResumeDialog(false)}
                filters={filters}
            />
            <ExpenseDialog
                openDialog={openExpenseDialog}
                setOpenDialog={setOpenExpenseDialog}
                expense={expenseSelected}
                onSave={fetchDataExpenses}
            />
        </>
    );
};

export default Reports;