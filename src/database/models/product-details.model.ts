import { Model } from "objection";

export default class ProductDetails extends Model implements IProductDetail {
    static get tableName(): string { return "product_details" };

    id!: number;
    product_id!: number;
    category_id!: number;
    price!: number;
    regular_price?: number | undefined;
    tax_rate?: number | undefined;
    stock!: number;
    attributes!: Record<string, any>;
    description?: string | undefined;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;
}

export interface IProductDetail {
    id: number;
    product_id: number;
    category_id: number;
    price: number;
    regular_price?: number;
    tax_rate?: number
    stock: number
    attributes: Record<string, any>;
    description?: string;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}