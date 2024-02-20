export interface IProductZyx {
    productid: number;
    code: string;
    description: string;
    image: string;
    barcode: string;
    purchase_price?: number;
    sale_price?: number;
    quantity: number;
    subtotal: number;
}