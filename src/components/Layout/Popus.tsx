import { Alert, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from 'stores';
import { manageConfirmation, showSnackbar } from 'stores/popus/actions';


// const useStyles = makeStyles({
//     cookieAlert: {
//         "& svg": {
//             color: 'white'
//         }
//     }
// });

const Popus: React.FC = () => {
    // const classes = useStyles();
    const dispatch = useDispatch();

    const popus = useSelector((state: IRootState) => state.popus);
    const snackbar = useSelector((state: IRootState) => state.popus.snackbar);
    // const lightbox = useSelector((state: IRootState) => state.popus.lightbox);

    const handleCloseSnackbar = () => dispatch(showSnackbar({ ...snackbar, show: false }));

    const manageConfirmationTmp = () => dispatch(manageConfirmation({ ...popus.question, visible: false }));

    // const manageLightBoxTmp = (lightboxtmp: any) => dispatch(manageLightBox(lightboxtmp));

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: snackbar.vertical || "top", horizontal: snackbar.horizontal || 'right' }}
                color="white"
                autoHideDuration={6000}
                open={snackbar.show}
                onClose={handleCloseSnackbar}
                key={'topright'}
            >
                <Alert
                    // className={classes.cookieAlert}
                    elevation={6}
                    variant="filled"
                    onClose={handleCloseSnackbar}
                    action={snackbar.action}
                    severity={snackbar.severity || "info"}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>
                        {snackbar.message}
                    </div>
                </Alert>
            </Snackbar>

            <Backdrop style={{ zIndex: 999999999, color: '#fff', }} open={popus.showBackDrop}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Dialog
                open={popus.question.visible}
                fullWidth
                maxWidth="sm"
                style={{ zIndex: 99999 }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Confirmación"}</DialogTitle>
                <DialogContent>
                    <DialogContentText color="textPrimary" sx={{ whiteSpace: "pre-wrap" }}>
                        {popus.question.question}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: "#FB5F5F" }}
                        onClick={() => {
                            popus.question.callbackcancel && popus.question.callbackcancel()
                            manageConfirmationTmp()
                        }}>
                        {popus.question.textCancel || "Cancelar"}
                    </Button>
                    <Button
                        variant="contained"
                        style={{ backgroundColor: "#55BD84" }}
                        onClick={() => {
                            popus.question.callback && popus.question.callback()
                            manageConfirmationTmp()
                        }}
                        color="primary">
                        {popus.question.textConfirm || "Continuar"}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* {lightbox.visible && (
                <Lightbox
                    reactModalStyle={{ overlay: { zIndex: 2000 } }}
                    mainSrc={lightbox.images[lightbox.index]}
                    nextSrc={lightbox.images[(lightbox.index + 1) % lightbox.images.length]}
                    prevSrc={lightbox.images[(lightbox.index + lightbox.images.length - 1) % lightbox.images.length]}
                    onCloseRequest={() => manageLightBoxTmp({ open: false, index: 0 })}
                    onMovePrevRequest={() => manageLightBoxTmp({ ...lightbox, index: (lightbox.index + lightbox.images.length - 1) % lightbox.images.length })}
                    onMoveNextRequest={() => manageLightBoxTmp({ ...lightbox, index: (lightbox.index + 1) % lightbox.images.length })}
                />
            )} */}

        </>
    );
}

export default Popus;