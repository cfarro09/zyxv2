import { IRequestBody, IRequestBodyPaginated, IUser } from '@types';

type IPaginated = {
    skip: number;
    take: number;
    filters: object;
    sorts: object;
};

export const getPropertySelByName = (propertyname: string, key = ''): IRequestBody => ({
    method: 'UFN_PROPERTY_SELBYNAME',
    key: `UFN_PROPERTY_SELBYNAME${key}`,
    parameters: {
        propertyname,
    },
});

export const paginatedPersonWithoutDateSel = ({ skip, take, filters, sorts }: IPaginated): IRequestBodyPaginated => ({
    methodCollection: 'UFN_PERSONWITHOUTDATE_SEL',
    methodCount: 'UFN_PERSONWITHOUTDATE_TOTALRECORDS',
    parameters: {
        skip,
        take,
        filters,
        sorts,
        origin: 'person',
        offset: (new Date().getTimezoneOffset() / 60) * -1,
    },
});

export const getUserSel = (orgid: number, userid: number): IRequestBody => ({
    method: 'UFN_USERS_SEL',
    key: 'UFN_USERS_SEL',
    parameters: {
        orgid,
        userid
    },
});


export const getDomainSel = (): IRequestBody => ({
    method: 'UFN_DOMAIN_SEL',
    key: 'UFN_DOMAIN_SEL',
    parameters: {},
});

export const userIns = (parameters: { operation: string } & IUser): IRequestBody => ({
    method: 'UFN_USER_INS',
    key: 'UFN_USER_INS',
    parameters: {
        ...parameters,
        address: "",
        phone: "",
        type: "NINGUNO"
    }
});

export const getRoles = (): IRequestBody => ({
    method: 'UFN_ROLE_LIST',
    key: 'UFN_ROLE_LIST',
    parameters: {},
});

export const getValuesFromDomain = (domainname: string): IRequestBody => ({
    method: 'UFN_DOMAIN_VALUES_SEL',
    key: `UFN_DOMAIN_VALUES_SEL-${domainname}`,
    parameters: {
        domainname
    },
});
