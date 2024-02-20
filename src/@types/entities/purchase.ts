import { IPayment } from "./payment";
import { IProductZyx } from "./productZyx";

export interface IPurchase {
    purchaseorderid: number;
    supplier : string;
    date: string;
    status: string;
    products: IProductZyx[]
    payments: IPayment[]
}