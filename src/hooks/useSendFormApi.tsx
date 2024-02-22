import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showBackdrop, showSnackbar, manageConfirmation } from 'stores/popus/actions'; // Ajusta las importaciones según tus archivos
import { IRequestBody, ITransaction, ObjectZyx } from '@types';
import { IRootState } from 'stores';
import { execute } from 'stores/main/actions';

interface SendFormApiProps {
    operation: "INSERT" | "DELETE" | "UPDATE";
    onSave: (_result?: ObjectZyx[]) => void; // Callback al guardar con éxito

    speechConfirmation?: string;
}

export const useSendFormApi = ({ onSave, operation, }: SendFormApiProps) => {
    const dispatch = useDispatch();
    const executeResult = useSelector((state: IRootState) => state.main.execute);
    const [waitSave, setWaitSave] = useState(false);
    const [speechConfirmation1, setspeechConfirmation1] = useState('');

    // Función para manejar el envío del formulario
    const onSubmitData = (requestBody: IRequestBody | ITransaction, transaction: boolean = false, speechQuestion: string = "", speechConfirmation: string = "") => {
        const callback = () => {
            dispatch(showBackdrop(true));
            dispatch(execute(requestBody, transaction));
            setWaitSave(true);
        };
        setspeechConfirmation1(speechConfirmation || operation === "DELETE" ? `Se eliminó satisfactoriamente` : `Guardado satisfactoriamente.`)
        dispatch(manageConfirmation({
            visible: true,
            question: speechQuestion || (operation === "DELETE" ? "¿Está seguro de eliminar el registro?" : `¿Está seguro que desea guardar el registro?`),
            callback
        }));
    };

    useEffect(() => {
        if (waitSave) {
            if (!executeResult.loading && !executeResult.error) {
                dispatch(showBackdrop(false));
                dispatch(showSnackbar({ show: true, severity: "success", message: speechConfirmation1 }));
                onSave(executeResult.data as ObjectZyx[]);
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