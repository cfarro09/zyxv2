import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Typography } from "@mui/material";
import React from "react";
import { InventoryDialogUploadProps } from "../models";
import { IClasses } from "@types";
import DropZone from "components/Controls/DropZone";
import { read as readXlsx, utils as xlsxUtils } from 'xlsx';

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

const InventoryDialogUpload: React.FC<InventoryDialogUploadProps> = ({ open, handleClose }) => {

    const handelFileLoad = (file: File) => {
        if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e?.target?.result);

                // Cambiar XLSX.read() a readXlsx()
                const workbook = readXlsx(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // Cambiar XLSX.utils.sheet_to_json() a xlsxUtils.sheet_to_json()
                const jsonData = xlsxUtils.sheet_to_json(sheet, { header: 1 });
                console.log('jsonData', jsonData)
            };
        }
        console.log('handelFileLoad', file);
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Importa tu archivo de inventario"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Sube tu archivo importando esta{" "}
                    <Typography color="primary" component="a" sx={classes.link}>
                        plantilla
                    </Typography> de ejemplo para actualizar tu inventario.
                    <Grid container sx={{ minHeight: '120px', marginTop: '1rem' }}>
                        <DropZone
                            url={''}
                            dispatchUpload={false}
                            handleLoadFile={handelFileLoad}
                            accept={{ 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['*'] }}
                        />
                    </Grid>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default InventoryDialogUpload;
