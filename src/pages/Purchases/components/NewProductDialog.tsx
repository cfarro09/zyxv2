import { Dialog, DialogContent } from "@mui/material";
import React from "react";
import type { ModalProps } from '@mui/material';

export interface AddProductProps {
    open: boolean;
    setOpenDialog: (_: boolean) => void;
    fetchData?: () => void;
    setValue?: (_: string, __: any) => void;
    productIndex?: number;
    newProductTitle?: string;
}

const NewProductDialog: React.FC<AddProductProps> = ({ open, setOpenDialog, productIndex, newProductTitle }) => {
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
                <h4>{newProductTitle || 'nada'}</h4>
            </DialogContent>
        </Dialog>
    );
};

export default NewProductDialog;
