import '@tanstack/react-table' //or vue, svelte, solid, etc.
import { ValueType } from 'components/Controls/FilterTableR'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right',
    type?: ValueType
  }
}


declare module '@tanstack/table-core' {
  interface FilterFns {
      myCustomFilter: FilterFn<unknown>
  }
}