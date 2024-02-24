import { IPayment } from "./payment";
import { IProductZyx } from "./productZyx";

export interface ISale {
    saleorderid: number;
    customerid: number;
    customerdesc?: string;
    order_date: string;
    billing?: boolean;
    status: string;
    order_number: string;
    cashier?: string;
    products: (IProductZyx & { saleorderlineid: number, inventoryid: number, stock?: number })[];
    payments: (IPayment & { saleorderpaymentid: number })[]
    total_amount: number;
    sub_total: number;
    total_quantity?: number;
}