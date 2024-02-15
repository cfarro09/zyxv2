import { IRequestBody, IRequestBodyPaginated } from '@types';

type IPaginated = {
    skip: number;
    take: number; 
    filters: object;
    sorts: object;
}

export const getPropertySelByName = (propertyname: string, key = ""): IRequestBody => ({
    method: 'UFN_PROPERTY_SELBYNAME',
    key: `UFN_PROPERTY_SELBYNAME${key}`,
    parameters: {
        propertyname
    }
});

export const paginatedPersonWithoutDateSel = ({ skip, take, filters, sorts }: IPaginated): IRequestBodyPaginated => ({
    methodCollection: "UFN_PERSONWITHOUTDATE_SEL",
    methodCount: "UFN_PERSONWITHOUTDATE_TOTALRECORDS",
    parameters: {
        skip,
        take,
        filters,
        sorts,
        origin: "person",
        offset: (new Date().getTimezoneOffset() / 60) * -1
    }
});