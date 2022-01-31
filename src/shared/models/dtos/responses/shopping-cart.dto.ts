export interface IShoppingCartDto {
    cart_id: number;
    user_id: number;
    username: string;
    products: CartDetail[] | any[],
    product_quantity: number;
    total_to_pay: number;
    created_at: Date;
    updated_at: Date;
}

export type CartDetail = {
    product_detail_id: number;
    name: string;
    price: number;
    description: string;
    regular_price: number;
    tax_rate?: number;
    attributes: Record<string, any>;
    quantity: number;
    sub_total: number;
    total: number;
}

export interface IRawShoppingCartDto {
    cart_id: number;
    user_id: number;
    username: string;
    product_detail_id: number;
    name: string;
    price: number;
    description: string;
    regular_price: number;
    tax_rate?: number;
    product_quantity: number;
    attributes: Record<string, any>;
    quantity: number;
    total_to_pay: number;
    sub_total: number;
    total: number;
    created_at: Date;
    updated_at: Date;
}