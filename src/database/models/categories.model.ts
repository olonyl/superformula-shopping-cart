import { Model } from "objection";

export default class Categories extends Model implements ICategory {
    static get tableName(): string { return "categories" };

    id!: number;
    name!: string;
    description?: string | undefined;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;
}

export interface ICategory {
    id: number;
    name: string;
    description?: string;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}