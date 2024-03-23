import FileSaver from 'file-saver';

type ColumnTmp = {
    Header: string;
    accessor: string;
    prefixTranslation?: string;
}
interface ObjectZyx {
    [key: string]: string | number | boolean | null;
}
export function exportExcel(filename: string, csvData: unknown[], columnsexport?: ColumnTmp[]): void {
    
    console.log("csvData", csvData)
    console.log("columnsexport", columnsexport)
    import('xlsx').then(XLSX => {
        const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const fileExtension = '.xlsx';
        let datafromtable = csvData;
        if (columnsexport) {
            // Initialize datafromtable as an array of ObjectZyx instead of unknown
            datafromtable = csvData.map((x: ObjectZyx) => {
                debugger
                const newx: ObjectZyx = {}; // ObjectZyx here instead of unknown
                columnsexport.forEach((y: ColumnTmp) => {
                    newx[y.header] = x[y.accessorKey]; // Make sure accessor matches the keys in csvData objects
                });
                return newx;
            });
        }
        console.log("datafromtable", datafromtable);
        const ws = XLSX.utils.json_to_sheet(datafromtable);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, filename + fileExtension);
    });
}