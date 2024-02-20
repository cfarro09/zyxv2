import { Box, Button, Grid, Typography } from '@mui/material';
import type { ModalProps } from '@mui/material';
import { IClasses, IStylesProps } from '@types';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { FileRejection, Accept } from 'react-dropzone';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { uploadFile } from 'stores/main/actions';
import { showBackdrop, showSnackbar } from 'stores/popus/actions';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

interface IFile {
    name?: string;
    size?: number;
    preview?: string;
}

const classes: IClasses = {
    dropzoneStyles: {
        border: '2px dashed #cccccc',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    imaginePreviewStyles: {
        border: '0 solid #dbdade',
        borderRadius: '.375rem',
        boxShadow: '0 .25rem 1.125rem rgba(75,70,92,.1)',
        position: 'relative',
        verticalAlign: 'top',
        margin: '.5rem',
        background: '#fff',
        fontSize: '.8125rem',
        boxSizing: 'content-box',
        cursor: 'default',
        flex: 1,
        maxWidth: '220px'
    },
    imageRemoveButtonStyles: {
        textTransform: 'none',
        borderTop: '1px solid #dbdade',
        color: '#6f6b7d',
        ':hover': {
            borderTop: '1px solid #dbdade',
        },
    },
    imageContainerStyles: {
        borderBottom: '1px solid #dbdade',
        borderTopLeftRadius: 'calc(0.375rem - 1px)',
        borderTopRightRadius: 'calc(0.375rem - 1px)',
        position: 'relative',
        padding: '.625rem',
        height: '7.5rem',
        textAlign: 'center',
        boxSizing: 'content-box',
    },
};

const styles: IStylesProps = {
    imageStyles: { width: '100%', height: '100%', objectFit: 'contain' },
    fileNameInfoStyles: { padding: '0 1rem', color: '#6f6b7d', textOverflow: 'ellipsis', overflow: 'hidden', width: '100%' }
}

interface DropZoneProps {
    url?: string;
    onFileUpload?: (_fileUrl: string) => void;
    accept?: Accept;
    dispatchUpload?: boolean;
    openDialog: boolean;
    setOpenDialog: (_: boolean) => void;
    handleLoadFile?: (_file: File) => void;
    title: string;
}

const DropZoneDialog: React.FC<DropZoneProps> = ({ url, dispatchUpload = true, onFileUpload, handleLoadFile, accept = { 'image/*': ['.png'] }, openDialog, setOpenDialog, title }) => {
    const dispatch = useDispatch();
    const [waitUpload, setWaitUpload] = useState(false)
    const uploadResult = useSelector((state: IRootState) => state.main.uploadFile);
    const [files, setFiles] = useState<IFile[]>([]);

    useEffect(() => {
        if (url) setFiles([{ name: url.split('/').pop(), preview: url }])
    }, [url])

    const handleFileUpload = useCallback((file: File) => {
        const formdata = new FormData();
        formdata.append("file", file);
        dispatch(uploadFile(formdata))
    }, [dispatch]);


    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (dispatchUpload) {
                handleFileUpload(file)
                setWaitUpload(true)
                dispatch(showBackdrop(true));
            } else {
                handleLoadFile && handleLoadFile(file);
            }
        }

        // Handle rejected files if needed
        if (rejectedFiles.length > 0) {
            console.log('Rejected files:', rejectedFiles);
        }
    }, [handleFileUpload]);

    useEffect(() => {
        if (waitUpload) {
            if (!uploadResult.loading && !uploadResult.error) {
                dispatch(showBackdrop(false));
                dispatch(showSnackbar({ show: true, severity: "success", message: `Tu archivo se ha subido exitosamente.` }));
                setFiles([
                    {
                        name: uploadResult?.url?.split('/').pop(),
                        preview: uploadResult?.url,
                    }
                ]);
                onFileUpload && onFileUpload(uploadResult?.url || '');
            } else if (uploadResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: `${uploadResult.code}` }));
                dispatch(showBackdrop(false));
                setWaitUpload(false);
            }
        }
    }, [uploadResult, waitUpload, dispatch]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept
    });

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    };

    const handleCancelModal: ModalProps['onClose'] = (_, reason) => {
        if (reason !== 'backdropClick') {
            setOpenDialog(false);
        }
    }

    return (
        <Dialog
            open={openDialog}
            maxWidth="sm"
            fullWidth
            onClose={handleCancelModal}
            disableEscapeKeyDown
            disableAutoFocus
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Grid container sx={classes.dropzoneStyles} padding={2} justifyContent={"center"}>
                    {!files.length && (
                        <Grid container item {...getRootProps()} alignContent={'center'}>
                            <input {...getInputProps()} />
                            <p style={{ textAlign: 'center' }}>Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos</p>
                        </Grid>
                    )}
                    {files.length > 0 && (
                        <Grid item container flexDirection={'column'} sx={classes.imaginePreviewStyles}>
                            {files.map((file, index) => (
                                <Grid item container key={file.name} flexGrow={1} flexDirection={'column'}>
                                    <Grid item container flexGrow={1} flexDirection={'column'}>
                                        <Grid item flexGrow={1} sx={classes.imageContainerStyles}>
                                            <img
                                                src={file.preview}
                                                alt={`Preview ${file.name}`}
                                                style={styles.imageStyles}
                                            />
                                        </Grid>
                                        <Box style={styles.fileNameInfoStyles}>
                                            <Typography noWrap style={{ fontSize: '13px', whiteSpace: 'normal' }}>{file.name}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            onClick={() => removeFile(index)}
                                            fullWidth
                                            sx={classes.imageRemoveButtonStyles}
                                        >
                                            <Typography color={"primary"}>{'Remover archivo'}</Typography>
                                        </Button>
                                    </Grid>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => setOpenDialog(false)}
                    disabled={uploadResult.loading}
                >Cancelar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DropZoneDialog;