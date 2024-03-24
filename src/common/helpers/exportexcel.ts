import { ColumnDef } from '@tanstack/react-table';
import FileSaver from 'file-saver';

interface IExportExcel<T> {
    filename: string;
    csvData: T[];
    columnsexport?: ColumnDef<T>[]
}

export const exportExcel = <T>({ filename, csvData, columnsexport }: IExportExcel<T>): void => {
    import('xlsx').then(XLSX => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        
        const datafromtable = columnsexport ? csvData.map((x) => (columnsexport.reduce((acc, item) => ({
            ...acc,
            [`${item.header}`]: (x as Record<string, object>)[item.id!!]
        }), {}) as T)) : csvData;
        
        const ws = XLSX.utils.json_to_sheet(datafromtable);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, filename + fileExtension);
    });
}