export interface IProductZyx {
    productid: number;
    code: string;
    description: string;
    image: string;
    barcode: string;
    purchase_price?: number;
    selling_price?: number;
    quantity: number;
    status: string;
    total: number;
}