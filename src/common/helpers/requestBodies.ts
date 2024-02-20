import { ICustomer, IDomainValue, IPayment, IProductZyx, IPurchase, IRequestBody, IRequestBodyPaginated, ISale, IUser } from '@types';
import { IInventoryFilters } from 'pages/Inventory/models';
import { IProduct } from 'pages/Product/models';

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

export const getUserSel = (userid: number): IRequestBody => ({
    method: 'UFN_USERS_SEL',
    key: 'UFN_USERS_SEL',
    parameters: {
        userid,
    },
});

export const getInventorySel = (parameters: IInventoryFilters): IRequestBody => ({
    method: 'UFN_INVENTORY_SEL',
    key: 'UFN_INVENTORY_SEL',
    parameters: {
        ...parameters
    },
});


export const getCustomerSel = (clientid: number): IRequestBody => ({
    method: 'UFN_CLIENT_SEL',
    key: 'UFN_CLIENT_SEL',
    parameters: {
        clientid
    },
});

export const customerIns = (customer: ICustomer, operation: string): IRequestBody => ({
    method: 'UFN_CLIENT_INS',
    key: 'UFN_CLIENT_INS',
    parameters: {
        ...customer,
        operation
    },
});
export const getProductSel = (productid: number, viewpurchase = false): IRequestBody => ({
    method: 'UFN_PRODUCT_SEL',
    key: 'UFN_PRODUCT_SEL',
    parameters: {
        productid,
        viewpurchase
    },
});

export const purchaseOrderIns = (purchase: (IPurchase & { operation: string })): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_OPS',
    key: 'UFN_PURCHASE_ORDER_OPS',
    parameters: {
        ...purchase,
        order_number: "",
        type: 'NINGUNO'
    },
});

export const purchaseOrderLineIns = (orderline: (IProductZyx & { operation: string, purchaseorderlineid: number })): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_LINE_OPS',
    key: 'UFN_PURCHASE_ORDER_LINE_OPS',
    parameters: {
        ...orderline,
        type: 'NINGUNO'
    },
});

export const purchaseOrderPaymentIns = (orderpayment: (IPayment & { operation: string, purchaseorderpaymentid: number })): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_PAYMENT_OPS',
    key: 'UFN_PURCHASE_ORDER_PAYMENT_OPS',
    parameters: {
        ...orderpayment,
        type: 'NINGUNO'
    },
});

export const getPurchaseOrder = (purchaseorderid: number): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_SEL',
    key: 'UFN_PURCHASE_ORDER_SEL',
    parameters: {
        purchaseorderid,
    },
});




export const saleOrderIns = (sale: (ISale & { operation: string })): IRequestBody => ({
    method: 'UFN_SALE_ORDER_OPS',
    key: 'UFN_SALE_ORDER_OPS',
    parameters: {
        ...sale,
        order_number: "",
        type: 'NINGUNO'
    },
});

export const saleOrderLineIns = (orderline: (IProductZyx & { operation: string, saleorderlineid: number })): IRequestBody => ({
    method: 'UFN_SALE_ORDER_LINE_OPS',
    key: 'UFN_SALE_ORDER_LINE_OPS',
    parameters: {
        ...orderline,
        type: 'NINGUNO'
    },
});

export const saleOrderPaymentIns = (orderpayment: (IPayment & { operation: string, saleorderpaymentid: number })): IRequestBody => ({
    method: 'UFN_SALE_ORDER_PAYMENT_OPS',
    key: 'UFN_SALE_ORDER_PAYMENT_OPS',
    parameters: {
        ...orderpayment,
        type: 'NINGUNO'
    },
});

export const getSaleOrder = (saleorderid: number): IRequestBody => ({
    method: 'UFN_SALE_ORDER_SEL',
    key: 'UFN_SALE_ORDER_SEL',
    parameters: {
        saleorderid,
    },
});




export const getDomainSel = (): IRequestBody => ({
    method: 'UFN_DOMAIN_SEL',
    key: 'UFN_DOMAIN_SEL',
    parameters: {},
});

export const domainIns = (domainValue: IDomainValue, operation: string): IRequestBody => ({
    method: 'UFN_DOMAIN_INS',
    key: 'UFN_DOMAIN_INS',
    parameters: {
        ...domainValue,
        type: 'NINGUNO',
        status: 'ACTIVO',
        operation

    },
});

export const userIns = (parameters: { operation: string } & IUser): IRequestBody => ({
    method: 'UFN_USER_INS',
    key: 'UFN_USER_INS',
    parameters: {
        ...parameters,
        user: parameters.username,
        username: undefined,
        address: '',
        phone: '',
        type: 'NINGUNO',
    },
});

export const bulkloadInventoryIns = (parameters: { data: string }): IRequestBody => ({
    method: 'UFN_INVENTORY_BULKLOAD_INS',
    key: 'UFN_INVENTORY_BULKLOAD_INS',
    parameters
});

export const productIns = (parameters: { operation: string } & IProduct): IRequestBody => ({
    method: 'UFN_PRODUCT_INS',
    key: 'UFN_PRODUCT_INS',
    parameters,
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
        domainname,
    },
});
