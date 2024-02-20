import { IPayment } from "./payment";
import { IProductZyx } from "./productZyx";

export interface ISale {
    saleorderid: number;
    warehouse: string;
    date: string;
    status: string;
    products: IProductZyx[]
    payments: IPayment[]
}