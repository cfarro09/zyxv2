import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ObjectZyx } from "@types";
import { SummaryProfit, formatMoney } from "common/helpers";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "stores";
import { getCollectionAux } from "stores/main/actions";

export interface ProfitResumeDialogProps {
    open: boolean;
    handleClose: () => void;
    filters?: { startdate: Date; enddate: Date; }
}

const ProfitResumeDialog: React.FC<ProfitResumeDialogProps> = ({ open, handleClose, filters }) => {
    const dispatch = useDispatch();
    const mainResultAux = useSelector((state: IRootState) => state.main.mainAux);
    const [data, setData] = useState<ObjectZyx>(null!)

    useEffect(() => {
        if (open) {
            dispatch(getCollectionAux(SummaryProfit(filters)))
        }
    }, [open])

    useEffect(() => {
        if (!mainResultAux.loading && !mainResultAux.error && mainResultAux.key === 'UFN_SALES_SUMMARY_PROFITABILITY') {
            setData((mainResultAux.data[0] as ObjectZyx) || {});
        }
    }, [mainResultAux])

    return (
        <Dialog
            open={open}
            maxWidth="sm"
            fullWidth
            onClose={handleClose}
        >
            <DialogTitle>
                {`Resume de Profit`}
                <Typography component={'span'} fontSize={14}> ({dayjs(filters?.startdate).format('DD-MM-YYYY')} a {dayjs(filters?.enddate).format('DD-MM-YYYY')})</Typography>
            </DialogTitle>
            <Grid container>
                {mainResultAux.loading &&
                    <Grid container justifyContent={"center"} height={100} alignItems={"center"}>
                        <CircularProgress />
                    </Grid>
                }
                {(!mainResultAux.loading && data != null) &&
                    <TableContainer sx={{ padding: '2rem 1rem' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Total Ventas</TableCell>
                                    <TableCell>Total Costo</TableCell>
                                    <TableCell>Ganancia</TableCell>
                                    <TableCell>%</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    <TableCell align="right">S/ {formatMoney(`${data?.total_sales || "0"}`)}</TableCell>
                                    <TableCell align="right">S/ {formatMoney(`${data?.total_cost || "0"}`)}</TableCell>
                                    <TableCell align="right">S/ {formatMoney(`${data?.total_profit || "0"}`)}</TableCell>
                                    <TableCell>{parseFloat(`${data?.total_profit_percentage || "0"}`).toFixed(2)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                }
            </Grid>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
            </DialogActions>

        </Dialog >
    );
};

export default ProfitResumeDialog;
