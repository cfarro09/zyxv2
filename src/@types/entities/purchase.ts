import { IPayment } from "./payment";

export interface IProductZyx {
    productid: number;
    code: string;
    description: string;
    image: string;
    barcode: string;
    purchase_price: number;
    quantity: number;
    subtotal: number;
}

export interface IPurchase {
    purchaseorderid: number;
    warehouse: string;
    date: string;
    status: string;
    products: IProductZyx[]
    payments: IPayment[]
}