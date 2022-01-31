import { Model, ModelOptions, QueryContext } from "objection";

export default class ShoppingCart extends Model implements IShoppingCart {
    static get tableName(): string { return "shopping_cart" };

    id!: number;
    user_id!: number;
    quantity!: number;
    total!: number;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): void | Promise<any> {
        this.updated_at = new Date();
    }

    static async getByUserId(id: number, columns: (keyof IShoppingCart | "*")[] = ["*"]): Promise<ShoppingCart | undefined> {
        return await this.query().select(...columns).where({ user_id: id, deleted: false }).first();
    }

    static async getById(id: number, columns: (keyof IShoppingCart | "*")[] = ["*"]): Promise<ShoppingCart | undefined> {
        return await this.query().select(...columns).where({ id, deleted: false }).first();
    }
}

export interface IShoppingCart {
    id: number;
    user_id: number;
    quantity: number;
    total: number;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}