/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRequestBody } from '@types';
import { IRootState } from 'stores';
import { getMultiCollection, resetMultiMain } from 'stores/main/actions';
import { FieldValues, UseFormReset } from 'react-hook-form';

//el setDataAux es el state del componente q invoca este hook, y se le setea directo
interface SendFormApiProps<T extends FieldValues, D> {
    registerX?: () => void;
    collections: { rb: IRequestBody, key: string, main?: boolean, keyData: string }[];
    reset?: UseFormReset<T>;
    setDataAux: (_: SetStateAction<D>) => void;
}

export const useMultiData = <T extends FieldValues, D,>({ registerX, collections, reset, setDataAux }: SendFormApiProps<T, D>) => {
    const dispatch = useDispatch();
    const multiResult = useSelector((state: IRootState) => state.main.multiData);

    const giveMeData = () => {
        registerX && registerX();
        dispatch(getMultiCollection(collections.map(q => q.rb)));
    };

    useEffect(() => {
        if (!multiResult.loading && !multiResult.error) {
            setDataAux(collections.reduce((acc, item) => {
                const collectionFound = multiResult.data.find((f) => f.key === item.key)?.data ?? [];
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
            }, {}) as D);
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