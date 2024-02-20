import { IPayment } from "./payment";
import { IProductZyx } from "./productZyx";

export interface IPurchase {
    purchaseorderid: number;
    supplier: string;
    warehouse: string;
    order_date: string;
    status: string;
    order_number: string;
    products: (IProductZyx & { purchaseorderlineid: number })[];
    payments: (IPayment & { purchaseorderpaymentid: number })[]
    total_amount: number;
    sub_total: number;
    total_quantity?: number;
}