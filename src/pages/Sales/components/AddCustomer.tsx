import React from "react";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import type { ModalProps } from '@mui/material';
import { ManageCustomer } from "pages/Customer/Index";

export interface AddCustomerProps {
    open: boolean;
    setOpenDialog: (_: boolean) => void;
    fetchData?: () => void;
}

const AddCustomer: React.FC<AddCustomerProps> = ({ open, setOpenDialog, fetchData }) => {

    const handleCancelModal: ModalProps['onClose'] = (_, reason) => {
        if (reason !== 'backdropClick') {
            setOpenDialog(false);
        }
    }

    return (
        <Dialog
            open={open}
            maxWidth="md"
            fullWidth
            onClose={handleCancelModal}
        >
            <DialogContent sx={{ paddingBottom: 1 }}>
                <ManageCustomer
                    baseUrl=""
                    callback={() => {
                        fetchData && fetchData();
                        setOpenDialog(false);
                    }}
                    onlyForm={true}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            </DialogActions>
        </Dialog >
    );
};

export default AddCustomer;
