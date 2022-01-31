import { Model } from "objection";

export default class Products extends Model implements IProduct {
    static get tableName(): string { return "products" };

    id!: number;
    name!: string;
    description?: string | undefined;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;
}

export interface IProduct {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}