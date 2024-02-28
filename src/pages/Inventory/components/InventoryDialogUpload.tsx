import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Grid, Switch, Typography } from "@mui/material";
import React from "react";
import { InventoryDialogUploadProps } from "../models";
import { IClasses } from "@types";
import DropZone from "components/Controls/DropZone";
import { useDispatch } from "react-redux";
import { showBackdrop, showSnackbar } from "stores/popus/actions";
import { exportExcel, uploadExcel, bulkloadInventoryIns } from "common/helpers";
import { useSendFormApi } from "hooks/useSendFormApi";

const classes: IClasses = {
    dialogTitle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
        color: "#000",
    },
    dialogContent: {
        fontSize: "1rem",
        fontWeight: "normal",
        color: "#000",
    },
    dialogActions: {
        fontSize: "1rem",
        fontWeight: "bold",
        color: "#000",
    },
    link: {
        cursor: 'pointer'
    }
};

const excelColumns = [
    {
        header: 'ALMACEN',
        key: 'warehouse',
        type: 'string',
        required: true,
    },
    {
        header: 'STOCK',
        key: 'stock',
        type: 'number',
        required: true,
    },
    {
        header: 'CODIGO PRODUCTO',
        key: 'code',
        type: 'string',
        required: true,
    }
]

interface IExcelColumn {
    header: string;
    key: string;
    type: string;
    required: boolean;
}

interface IExcelData {
    [key: string]: string;
}

const validateData = (data: IExcelData[], columns: IExcelColumn[]) => {
    const newData: IExcelData[] = [];
    let errorMessage = '';

    for (const row of data) {
        const newRow: IExcelData = {};

        for (const column of columns) {
            const columnName = column.header
            const key = column.key;

            if (column.required && !Object.prototype.hasOwnProperty.call(row, columnName)) {
                errorMessage = `Columna '${columnName}' es requerida pero no se encuentra en la fila`;
                break;
            }
            newRow[key as string] = row[columnName];
        }
        newData.push(newRow);
    }
    return [errorMessage, newData];
}

const InventoryDialogUpload: React.FC<InventoryDialogUploadProps> = ({ open, handleClose, fetchData }) => {
    const dispatch = useDispatch();
    const { onSubmitData } = useSendFormApi({
        operation: "INSERT",
        onSave: () => { handleClose(); fetchData() },
    });

    const generateExcel = () => {
        exportExcel(
            'plantilla-inventario.xlsx',
            excelColumns.map((x) => ({ [x.header]: '' }))
        )
    }

    const handelFileLoad = async (file: File) => {
        if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
            const excelData: IExcelData[] = await uploadExcel(file) as IExcelData[];
            const [validate, data] = validateData(excelData, excelColumns);

            if (validate) {
                dispatch(showSnackbar({ show: true, severity: "error", message: validate as string }));
                dispatch(showBackdrop(false));
                return;
            }

            handleSubmit(data as IExcelData[])
        }
    }

    const handleSubmit = (data: IExcelData[]) => {
        onSubmitData(bulkloadInventoryIns({ data: JSON.stringify(data) }));
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                {"Importa tu archivo de inventario"}
            </DialogTitle>
            <DialogContent>
                <Grid container gap={1}>
                    <Grid item>
                        <DialogContentText id="alert-dialog-description" component={'div'}>
                            <p>Sube tu archivo importando esta{" "}
                                <Typography color="primary" component="a" sx={classes.link} onClick={generateExcel}>
                                    plantilla
                                </Typography> de ejemplo para actualizar tu inventario.</p>

                        </DialogContentText>
                    </Grid>

                    <FormControlLabel
                        sx={{ color: '#5b5b5b', fontSize: '0.5rem', '& .MuiTypography-root': { fontSize: '0.875rem' } }}
                        control={<Switch />}
                        label="El sistema crea automaticamente el producto en caso no exista"
                    />

                    <Grid container sx={{ minHeight: '120px', marginTop: '1rem' }}>
                        <DropZone
                            url={''}
                            dispatchUpload={false}
                            handleLoadFile={handelFileLoad}
                            accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['*'] }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InventoryDialogUpload;
