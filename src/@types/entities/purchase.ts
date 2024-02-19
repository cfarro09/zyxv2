import { IProduct } from "pages/Product/models";
import { IPayment } from "./payment";

export interface IPurchase {
    purchaseorderid: number;
    clientid: number;
    date: string;
    status: string;
    products: IProduct[]
    payments: IPayment[]
}