import { IPayment } from "./payment";
import { IProductZyx } from "./productZyx";

export interface ISale {
    saleorderid: number;
    customerid: number;
    customerdesc?: string;
    order_date: string;
    status: string;
    order_number: string;
    products: (IProductZyx & { saleorderlineid: number })[];
    payments: (IPayment & { saleorderpaymentid: number })[]
    total_amount: number;
    sub_total: number;
    total_quantity?: number;
}