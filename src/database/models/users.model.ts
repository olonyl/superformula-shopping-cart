import { Model, QueryContext } from "objection";
import { compare, genSalt, hash } from "bcrypt";

export default class Users extends Model implements IUser {
    static get tableName(): string { return "users" };

    id!: number;
    email!: string;
    username!: string;
    normalized_email!: string;
    normalized_username!: string;
    password!: string;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;

    public async $beforeInsert(queryContext: QueryContext): Promise<void> {
        const salt: string = await genSalt(10);
        this.normalized_email = this.email.toUpperCase().trim();
        this.normalized_username = this.username.toLocaleUpperCase().trim();
        this.password = await hash(this.password, salt);
    }

    public async matchPassword(password: string): Promise<boolean> {
        return await compare(password, this.password);
    }
}

export interface IUser {
    id: number;
    email: string;
    username: string;
    normalized_email: string;
    normalized_username: string;
    password: string;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}