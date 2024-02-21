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
    fetchData: () => void;
}

export interface IKardex {
    kardexid: number;
    inventoryid: number;
    warehouse: string;
    in_quantity: number;
    out_quantity: number;
    document_type: string;
    document_id: number;
    stock: number;
    createdate: string;
}

export interface IKardexFilter {
    startdate: Date;
    enddate: Date;
    inventoryid: number;
}

export interface KardexFiltersProps {
    filters: IKardexFilter;
    setFilters: React.Dispatch<React.SetStateAction<IKardexFilter>>;
    fetchData: () => void;
}