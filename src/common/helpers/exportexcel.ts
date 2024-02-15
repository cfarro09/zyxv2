import * as FileSaver from 'file-saver';

type ColumnTmp = {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
    type?: string
}
interface ObjectZyx {
    [key: string]: string | number | boolean | null;
}
export function exportExcel(filename: string, csvData: ObjectZyx[], columnsexport?: ColumnTmp[]): void {
    import('xlsx').then(XLSX => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        let datafromtable = csvData;
        if (columnsexport) {
            datafromtable = csvData.map((x: ObjectZyx) => {
                const newx: ObjectZyx = {};
                columnsexport.forEach((y: ColumnTmp) => {
                    newx[y.Header] =  (y.type === "porcentage" ? `${(Number(x[y.accessor]) * 100).toFixed(0)}%` : x[y.accessor])
                });
                return newx;
            });
        }
        const ws = XLSX.utils.json_to_sheet(datafromtable);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, filename + fileExtension);
    });
}