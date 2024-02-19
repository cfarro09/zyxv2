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