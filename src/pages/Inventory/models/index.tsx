export interface IInventory {
    inventoryid: number;
    productid: number;
    title: string;
    code: string;
    stock: string;
    warehouse: string;
    changedate: string;
}

export interface IInventoryFilters {
    warehouse: string;
}

export interface IDomainValue {
    domainid: number;
    domainname: string;
    domaindesc: string;
    domainvalue: string;
}

export interface IDataAux {
    listWarehouse: IDomainValue[];
}

export interface InventoryFiltersProps {
    dataAux: IDataAux;
    filters: IInventoryFilters;
    loading: boolean;
    handleChange: (_value: IDomainValue) => void;
}

export interface InventoryDialogUploadProps {
    open: boolean;
    handleClose: () => void;
}