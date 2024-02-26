/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, SetStateAction, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRequestBody } from '@types';
import { IRootState } from 'stores';
import { getMultiCollection, resetMultiMain } from 'stores/main/actions';
import { FieldValues, UseFormReset } from 'react-hook-form';
import { showBackdrop } from 'stores/popus/actions';

//el setDataAux es el state del componente q invoca este hook, y se le setea directo
interface SendFormApiProps<T extends FieldValues, D> {
    registerX?: () => void;
    collections: { rb: IRequestBody, key: string, main?: boolean, keyData: string }[];
    reset?: UseFormReset<T>;
    setDataAux: (_: SetStateAction<D>) => void;
    triggerShowBackdrop?: boolean
}

export const useMultiData = <T extends FieldValues, D,>({ registerX, collections, reset, setDataAux, triggerShowBackdrop }: SendFormApiProps<T, D>) => {
    const dispatch = useDispatch();
    const multiResult = useSelector((state: IRootState) => state.main.multiData);
    const [waitingUseEffect, setWaitingUseEffect] = useState(false);

    const giveMeData = (keys?: string[]) => {
        setWaitingUseEffect(true)
        registerX && registerX();
        if (triggerShowBackdrop) {
            dispatch(showBackdrop(true));
        }
        dispatch(getMultiCollection(collections.filter(q => (!keys || keys.includes(q.key))).map(q => q.rb)));
    };

    useEffect(() => {
        if (waitingUseEffect && multiResult.data.length > 0) {
            if (!multiResult.loading && !multiResult.error) {
                setWaitingUseEffect(false);
                if (triggerShowBackdrop) {
                    dispatch(showBackdrop(false));
                }
                const aa = collections.reduce((acc, item) => {
                    const collectionFound = multiResult.data.find((f) => f.key === item.key)?.data;
                    if (!collectionFound)
                        return acc;
                    if (item.main) {
                        reset && reset(collectionFound[0] as T);
                        registerX && registerX()
                        return acc;
                    } else {
                        return {
                            ...acc,
                            [item.keyData]: collectionFound
                        }
                    }
                }, {}) as D
                setDataAux(prev => ({
                    ...prev,
                    ...aa
                }));
            }
        }
    }, [multiResult]);

    useEffect(() => {
        return () => {
            dispatch(resetMultiMain())
        }
    }, []);

    return {
        giveMeData, loading: multiResult.loading
    };
};