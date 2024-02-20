import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showBackdrop, showSnackbar, manageConfirmation } from 'stores/popus/actions'; // Ajusta las importaciones según tus archivos
import { IRequestBody } from '@types';
import { IRootState } from 'stores';
import { execute } from 'stores/main/actions';

interface SendFormApiProps {
    operation: "INSERT" | "DELETE" | "UPDATE";
    onSave: () => void; // Callback al guardar con éxito
}

export const useSendFormApi = ({ onSave, operation }: SendFormApiProps) => {
    const dispatch = useDispatch();
    const executeResult = useSelector((state: IRootState) => state.main.execute);
    const [waitSave, setWaitSave] = useState(false);

    // Función para manejar el envío del formulario
    const onSubmitData = (requestBody: IRequestBody) => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(requestBody));
            setWaitSave(true);
        };

        dispatch(manageConfirmation({
            visible: true,
            question: operation === "DELETE" ? "¿Está seguro de eliminar el registro?" : `¿Está seguro que desea guardar el registro?`,
            callback
        }));
    };

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                dispatch(showSnackbar({ show: true, severity: "success", message: operation === "DELETE" ? `Se eliminó satisfactoriamente` : `Guardado satisfactoriamente.` }));
                onSave();
                setWaitSave(false); // Asegurar reinicio del estado
            } else if (executeResult.error) {
                dispatch(showSnackbar({ show: true, severity: "error", message: executeResult.usererror ? executeResult.usererror : `${executeResult.code}` }));
                dispatch(showBackdrop(false));
                setWaitSave(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [executeResult, waitSave, dispatch, onSave]);

    return {
        onSubmitData,
    };
};