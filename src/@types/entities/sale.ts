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

export interface IExpense {
    expenseid: number;
    description: string;
    expense_amount: number;
    expense_date: string;
    evidence_url: string;
    status?: string;
}