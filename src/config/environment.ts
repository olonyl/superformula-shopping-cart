import { config } from "dotenv";
const path = require('path');

export default class Environment {
    constructor() {
        var environment = process.env.NODE_ENV || 'development';
        config({
            path: path.resolve(__dirname, `${environment}.env`)
        });
    }

    public get PORT(): number {
        return Number(process.env.PORT) || 3000;
    }

    public get SERVER(): string {
        return process.env.SERVER_NAME || "";
    }

    public get USERNAME(): string {
        return process.env.PSQL_USERNAME || "";
    }

    public get PASSWORD(): string {
        return process.env.PSQL_PASSWORD || "${Password}";
    }

    public get DATABASE(): string {
        return process.env.DATABASE_NAME || "";
    }

    public get JWT_SECRET_KEY(): string {
        return process.env.JWT_SECRET_KEY || "";
    }

    public get JWT_EXPIRES_IN(): string {
        return process.env.JWT_EXPIRES_IN || "1h";
    }

    public get DATABASE_URL(): string {
        return process.env.DATABASE_URL || "";
    }
}