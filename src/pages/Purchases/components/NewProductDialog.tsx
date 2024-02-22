import { Dialog, DialogContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import type { ModalProps } from '@mui/material';
import { ManageProduct } from "pages/Product/Index";
import { IProduct } from "pages/Product/models";

export interface AddProductProps {
    open: boolean;
    setOpenDialog: (_: boolean) => void;
    productIndex?: number;
    newProductTitle?: string;
    handleNewProduct: (_value: IProduct, _index: number) => void;
}

const NewProductDialog: React.FC<AddProductProps> = ({ open, setOpenDialog, productIndex, newProductTitle, handleNewProduct }) => {
    const [newProduct, setNewProduct] = useState<IProduct | null>(null)

    useEffect(() => {
        handleNewProduct(newProduct as IProduct, productIndex!)
        setOpenDialog(false);
    }, [newProduct])


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
                <ManageProduct
                    baseUrl=""
                    onlyForm={true}
                    newTitle={newProductTitle}
                    setNewProduct={setNewProduct as React.Dispatch<React.SetStateAction<IProduct>>}
                    callback={() => {
                        setOpenDialog(false);
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};

export default NewProductDialog;
