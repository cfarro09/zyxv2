import { IPayment } from "./payment";

export interface IProductZyx {
    productid: number;
    code: string;
    description: string;
    image: string;
    barcode: string;
    sale_price: number;
    quantity: number;
    subtotal: number;
}

export interface ISale {
    saleorderid: number;
    warehouse: string;
    date: string;
    status: string;
    products: IProductZyx[]
    payments: IPayment[]
}