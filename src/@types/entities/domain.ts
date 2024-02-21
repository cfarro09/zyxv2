export interface IDomain {
    domainname: string;
    count: number;
    status: string;
}

export interface IDomainValue {
    domainid: number;
    domainname: string;
    domaindesc: string;
    domainvalue: string;
    bydefault?: boolean;
}
