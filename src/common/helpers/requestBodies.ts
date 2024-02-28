import {
    ICustomer,
    IDomainValue,
    IExpense,
    IPayment,
    IProductZyx,
    IPurchase,
    IRequestBody,
    IRequestBodyPaginated,
    ISale,
    IUser,
} from '@types';
import { IInventoryFilters, IKardexFilter } from 'pages/Inventory/models';
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
        ...parameters,
    },
});

export const getKardexSel = (parameters: IKardexFilter): IRequestBody => ({
    method: 'UFN_KARDEX_SEL',
    key: 'UFN_KARDEX_SEL',
    parameters: {
        ...parameters,
    },
});

export const getCustomerSel = (clientid: number): IRequestBody => ({
    method: 'UFN_CLIENT_SEL',
    key: 'UFN_CLIENT_SEL',
    parameters: {
        clientid,
    },
});

export const customerIns = (customer: ICustomer, operation: string): IRequestBody => ({
    method: 'UFN_CLIENT_INS',
    key: 'UFN_CLIENT_INS',
    parameters: {
        ...customer,
        operation,
    },
});

export const transferInventory = (inventoryid: number, warehouse_destiny: string, quantity: number): IRequestBody => ({
    method: 'UFN_INVENTORY_TRANSFER',
    key: 'UFN_INVENTORY_TRANSFER',
    parameters: {
        inventoryid,
        warehouse_destiny,
        quantity,
    },
});

export const getProductSel = (productid: number, viewpurchase = false): IRequestBody => ({
    method: 'UFN_PRODUCT_SEL',
    key: 'UFN_PRODUCT_SEL',
    parameters: {
        productid,
        viewpurchase,
    },
});

export const getStockSel = (): IRequestBody => ({
    method: 'UFN_STOCK_SEL',
    key: 'UFN_STOCK_SEL',
    parameters: {},
});

export const purchaseOrderIns = (purchase: IPurchase & { operation: string }): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_OPS',
    key: 'UFN_PURCHASE_ORDER_OPS',
    parameters: {
        ...purchase,
        order_number: '',
        type: 'NINGUNO',
    },
});

export const purchaseOrderLineIns = (
    orderline: IProductZyx & { operation: string; purchaseorderlineid: number },
): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_LINE_OPS',
    key: 'UFN_PURCHASE_ORDER_LINE_OPS',
    parameters: {
        ...orderline,
        purchaseorderlineid: orderline.purchaseorderlineid || 0,
        type: 'NINGUNO',
    },
});

export const purchaseOrderPaymentIns = (
    orderpayment: IPayment & { operation: string; purchaseorderpaymentid: number },
): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_PAYMENT_OPS',
    key: 'UFN_PURCHASE_ORDER_PAYMENT_OPS',
    parameters: {
        ...orderpayment,
        purchaseorderpaymentid: orderpayment.purchaseorderpaymentid,
        type: 'NINGUNO',
    },
});

export const getPurchaseOrder = (purchaseorderid: number): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_SEL',
    key: 'UFN_PURCHASE_ORDER_SEL',
    parameters: {
        purchaseorderid,
    },
});

export const saleOrderIns = (sale: ISale & { operation: string }): IRequestBody => ({
    method: 'UFN_SALE_ORDER_OPS',
    key: 'UFN_SALE_ORDER_OPS',
    parameters: {
        ...sale,
        order_number: '',
        type: 'NINGUNO',
    },
});

export const CancelSale = (saleorderid: number): IRequestBody => ({
    method: 'UFN_SALE_ORDER_CANCEL',
    key: 'UFN_SALE_ORDER_CANCEL',
    parameters: {
        saleorderid,
    },
});

export const cancelPurchaseOrder = (purchaseorderid: number): IRequestBody => ({
    method: 'UFN_PURCHASE_ORDER_CANCEL',
    key: 'UFN_PURCHASE_ORDER_CANCEL',
    parameters: {
        purchaseorderid,
    },
});

export const saleOrderLineIns = (
    orderline: IProductZyx & { operation: string; saleorderlineid: number },
): IRequestBody => ({
    method: 'UFN_SALE_ORDER_LINE_OPS',
    key: 'UFN_SALE_ORDER_LINE_OPS',
    parameters: {
        ...orderline,
        sale_price: orderline.selling_price,
        type: 'NINGUNO',
    },
});

export const saleOrderPaymentIns = (
    orderpayment: IPayment & { operation: string; saleorderpaymentid: number },
): IRequestBody => ({
    method: 'UFN_SALE_ORDER_PAYMENT_OPS',
    key: 'UFN_SALE_ORDER_PAYMENT_OPS',
    parameters: {
        ...orderpayment,
        type: 'NINGUNO',
    },
});
interface IFilterDate {
    startdate: Date;
    enddate: Date;
}
export const getSalePayment = (dates: IFilterDate | null = null): IRequestBody => ({
    method: 'UFN_SALE_PAYMENTS_RESUME_REPORT',
    key: 'UFN_SALE_PAYMENTS_RESUME_REPORT',
    parameters: {
        startdate: dates?.startdate || '',
        enddate: dates?.enddate || '',
    },
});

export const getExpenses = (expenseid: number = 0): IRequestBody => ({
    method: 'UFN_EXPENSE_SEL',
    key: 'UFN_EXPENSE_SEL',
    parameters: {
        expenseid
    },
});

export const expenseIns = (parameters: { operation: string } & IExpense): IRequestBody => ({
    method: 'UFN_EXPENSE_INS',
    key: 'UFN_EXPENSE_INS',
    parameters,
});

export const getPaymentsByDateAndMethod = (date: string, payment_method: string): IRequestBody => ({
    method: 'UFN_SALE_PAYMENTS_BY_DATE_METHOD',
    key: 'UFN_SALE_PAYMENTS_BY_DATE_METHOD',
    parameters: {
        date,
        payment_method,
    },
});

export const SummaryProfit = ( dates: IFilterDate | null = null): IRequestBody => ({
    method: 'UFN_SALES_SUMMARY_PROFITABILITY',
    key: 'UFN_SALES_SUMMARY_PROFITABILITY',
    parameters: { 
        startdate: dates?.startdate || '',
        enddate: dates?.enddate || '',
     },
});

export const getSaleOrder = (saleorderid: number, dates: IFilterDate | null = null): IRequestBody => ({
    method: 'UFN_SALE_ORDER_SEL',
    key: 'UFN_SALE_ORDER_SEL',
    parameters: {
        saleorderid,
        startdate: dates?.startdate || '',
        enddate: dates?.enddate || '',
    },
});

export const getSalePaymentsResume = ( dates: IFilterDate | null = null): IRequestBody => ({
    method: 'UFN_SALE_PAYMENTS_RESUME',
    key: 'UFN_SALE_PAYMENTS_RESUME',
    parameters: {
        startdate: dates?.startdate || '',
        enddate: dates?.enddate || '',
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
        bydefault: domainValue.bydefault ?? false,
        type: 'NINGUNO',
        status: 'ACTIVO',
        operation,
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
    parameters,
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
