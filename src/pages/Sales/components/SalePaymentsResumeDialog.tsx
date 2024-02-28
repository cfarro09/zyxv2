import { BorderTop } from "@mui/icons-material";
import { Button, CircularProgress, Dialog, DialogActions, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { ObjectZyx } from "@types";
import { formatMoney, getSalePaymentsResume } from "common/helpers";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "stores";
import { getCollectionAux } from "stores/main/actions";

export interface SalePaymentsResumeDialogProps {
    open: boolean;
    handleClose: () => void;
    filters?: { startdate: Date; enddate: Date; }
}

const SalePaymentsResumeDialog: React.FC<SalePaymentsResumeDialogProps> = ({ open, handleClose, filters }) => {
    const dispatch = useDispatch();
    const mainResultAux = useSelector((state: IRootState) => state.main.mainAux);
    const [data, setData] = useState<ObjectZyx[]>([])

    useEffect(() => {
        if (open) {
            console.log({ filters })
            dispatch(getCollectionAux(getSalePaymentsResume(filters)))
        }
    }, [open])

    useEffect(() => {
        if (!mainResultAux.loading && !mainResultAux.error && mainResultAux.key === 'UFN_SALE_PAYMENTS_RESUME') {
            console.log('mainResultAux.data', mainResultAux.data)
            setData((mainResultAux.data as ObjectZyx[]) || []);
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
                {`Resume de pagos de las ventas`}
                <Typography component={'span'} fontSize={14}> ({dayjs(filters?.startdate).format('DD-MM-YYYY')} a {dayjs(filters?.enddate).format('DD-MM-YYYY')})</Typography>
            </DialogTitle>
            <Grid container>
                {mainResultAux.loading &&
                    <Grid container justifyContent={"center"} height={100} alignItems={"center"}>
                        <CircularProgress />
                    </Grid>
                }
                {!mainResultAux.loading &&
                    <TableContainer sx={{ padding: '2rem 1rem' }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Metodo de Pago</TableCell>
                                    <TableCell>Cantidad de Transacciones</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{row.payment_method}</TableCell>
                                        <TableCell>{row.count}</TableCell>
                                        <TableCell align="right">S/ {formatMoney(`${row.total}`)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow sx={{ borderTop: '2px solid #959595' }}>
                                    <TableCell rowSpan={1} />
                                    <TableCell colSpan={1}><b>Total</b></TableCell>
                                    <TableCell align="right">
                                        <b>S/ {formatMoney(data.reduce((sum, row) => sum + (parseFloat(row.total as string) || 0), 0).toString())}</b>
                                    </TableCell>
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

export default SalePaymentsResumeDialog;
