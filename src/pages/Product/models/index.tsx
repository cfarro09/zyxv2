export interface IProduct {
    productid: number;
    code: string;
    barcode: string;
    purchase_price: number;
    title: string;
    description: string;
    image: string;
    selling_price: number;
    unit: string;
    color: string;
    status: string;
    category: string;
    stock?: number;
}