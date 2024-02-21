import { useSelector as $useSelector } from 'react-redux';
import { IRootState } from 'stores';

export function useSelector<T>(
    fn: (_: IRootState) => T,
    equalityFn?: (_: T, _1: T) => boolean,
) {
    return $useSelector<IRootState, T>(fn, equalityFn);
}
